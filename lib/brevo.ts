/**
 * Brevo (formerly Sendinblue) Server-Side API Service.
 *
 * CRITICAL SECURITY NOTICE:
 * - This module MUST only be imported and called on the server side.
 * - BREVO_API_KEY must NEVER be exposed to the client.
 */

export interface SubscribeParams {
  name: string;
  email: string;
  phone?: string;
}

export interface BrevoResult {
  success: boolean;
  isDuplicate?: boolean;
  contactId?: string;
  isDoubleOptIn?: boolean;
  error?: string;
  statusCode?: number;
}

/** Helper to mask email for safe logging */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  const maskedLocal = local.length > 2 ? `${local[0]}***${local[local.length - 1]}` : '***';
  return `${maskedLocal}@${domain}`;
}

/**
 * Executes a fetch to Brevo REST API with an 8-second timeout and 1 transient retry.
 */
async function fetchBrevo(
  endpoint: string,
  payload: Record<string, unknown>,
  apiKey: string,
  attempt: number = 1
): Promise<{ status: number; data: any; ok: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`https://api.brevo.com/v3${endpoint}`, {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    let data: any = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch {
        data = { message: responseText };
      }
    }

    // Bounded retry for transient failures (408, 429, 5xx) on first attempt
    if (!response.ok && attempt === 1 && [408, 429, 500, 502, 503, 504].includes(response.status)) {
      console.warn(
        `[Brevo API] Transient error ${response.status} on attempt ${attempt}. Retrying once...`
      );
      // Brief backoff of 500ms
      await new Promise((res) => setTimeout(res, 500));
      return fetchBrevo(endpoint, payload, apiKey, 2);
    }

    return { status: response.status, data, ok: response.ok };
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (attempt === 1) {
      console.warn(`[Brevo API] Network/timeout error (${err.message}). Retrying once...`);
      await new Promise((res) => setTimeout(res, 500));
      return fetchBrevo(endpoint, payload, apiKey, 2);
    }
    throw err;
  }
}

/**
 * Adds or updates a contact in Brevo.
 * Supports standard single opt-in and double opt-in workflows.
 */
export async function addOrUpdateBrevoContact({
  name,
  email,
  phone,
}: SubscribeParams): Promise<BrevoResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const listIdRaw = process.env.BREVO_LIST_ID;
  const doiTemplateIdRaw = process.env.BREVO_DOUBLE_OPT_IN_TEMPLATE_ID;
  const doiRedirectUrl = process.env.BREVO_CONFIRMATION_REDIRECT_URL;

  if (!apiKey || !apiKey.trim()) {
    console.error('[Brevo API] Missing BREVO_API_KEY environment variable.');
    return {
      success: false,
      error: 'Brevo API key configuration is missing.',
    };
  }

  if (!listIdRaw) {
    console.error('[Brevo API] Missing BREVO_LIST_ID environment variable.');
    return {
      success: false,
      error: 'Brevo list ID configuration is missing.',
    };
  }

  const listId = parseInt(listIdRaw, 10);
  if (isNaN(listId)) {
    console.error('[Brevo API] Invalid BREVO_LIST_ID environment variable.');
    return {
      success: false,
      error: 'Brevo list ID must be a numeric value.',
    };
  }

  const maskedEmail = maskEmail(email);
  const doiTemplateId = doiTemplateIdRaw ? parseInt(doiTemplateIdRaw, 10) : null;
  const isDoiConfigured = !!(doiTemplateId && !isNaN(doiTemplateId) && doiRedirectUrl);

  const attributes: Record<string, string> = {
    FIRSTNAME: name,
  };
  if (phone && phone.trim()) {
    attributes.SMS = phone.trim();
    attributes.PHONE = phone.trim();
  }

  try {
    if (isDoiConfigured) {
      // -------------------------------------------------------------
      // Double Opt-In Flow
      // -------------------------------------------------------------
      console.log(
        `[Brevo API] Executing Double Opt-In subscription for ${maskedEmail} (List: ${listId}, Template: ${doiTemplateId})`
      );

      const doiPayload = {
        email,
        attributes,
        includeListIds: [listId],
        templateId: doiTemplateId,
        redirectionUrl: doiRedirectUrl,
      };

      const result = await fetchBrevo(
        '/contacts/doubleOptinConfirmation',
        doiPayload,
        apiKey
      );

      if (result.ok || result.status === 201 || result.status === 204) {
        console.log(`[Brevo API] DOI email dispatched successfully to ${maskedEmail}`);
        return {
          success: true,
          isDoubleOptIn: true,
          contactId: result.data?.id ? String(result.data.id) : undefined,
        };
      }

      // Check if duplicate contact error
      const errorCode = result.data?.code;
      const errorMessage = result.data?.message || '';
      if (
        result.status === 400 &&
        (errorCode === 'duplicate_parameter' ||
          errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('duplicate'))
      ) {
        console.log(
          `[Brevo API] Contact ${maskedEmail} already exists in Brevo. Falling back to update.`
        );

        // Update contact directly to ensure list inclusion
        const updateResult = await fetchBrevo(
          '/contacts',
          {
            email,
            attributes,
            listIds: [listId],
            updateEnabled: true,
          },
          apiKey
        );

        return {
          success: true,
          isDuplicate: true,
          contactId: updateResult.data?.id ? String(updateResult.data.id) : undefined,
        };
      }

      console.error(
        `[Brevo API] DOI failed with status ${result.status}: ${JSON.stringify(result.data)}`
      );
      return {
        success: false,
        statusCode: result.status,
        error: 'Failed to initiate double opt-in subscription with provider.',
      };
    } else {
      // -------------------------------------------------------------
      // Single Opt-In Flow (Default / Standard)
      // -------------------------------------------------------------
      console.log(
        `[Brevo API] Executing Single Opt-In subscription for ${maskedEmail} (List: ${listId})`
      );

      const payload = {
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      };

      const result = await fetchBrevo('/contacts', payload, apiKey);

      if (result.ok || result.status === 201 || result.status === 204) {
        const isDup = result.status === 204;
        console.log(`[Brevo API] Contact ${maskedEmail} saved successfully (Duplicate: ${isDup})`);
        return {
          success: true,
          isDuplicate: isDup,
          contactId: result.data?.id ? String(result.data.id) : undefined,
        };
      }

      // Handle duplicate contact code if returned as 400
      const errorCode = result.data?.code;
      const errorMessage = result.data?.message || '';
      if (
        result.status === 400 &&
        (errorCode === 'duplicate_parameter' ||
          errorMessage.toLowerCase().includes('already exists') ||
          errorMessage.toLowerCase().includes('duplicate'))
      ) {
        console.log(`[Brevo API] Contact ${maskedEmail} is already subscribed in Brevo.`);
        return {
          success: true,
          isDuplicate: true,
        };
      }

      console.error(
        `[Brevo API] Subscription failed with status ${result.status}: ${JSON.stringify(result.data)}`
      );
      return {
        success: false,
        statusCode: result.status,
        error: 'Failed to create contact with email provider.',
      };
    }
  } catch (error: any) {
    console.error(`[Brevo API] Error for ${maskedEmail}:`, error.message || error);
    return {
      success: false,
      error: 'Communication timeout or network failure with Brevo service.',
    };
  }
}
