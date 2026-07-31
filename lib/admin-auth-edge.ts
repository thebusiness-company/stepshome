/**
 * Edge-compatible admin token verification using the Web Crypto API.
 * This file MUST NOT import 'crypto' from Node.js — it only uses
 * the globally available `crypto.subtle` (SubtleCrypto), which works
 * in both Edge Runtime (middleware) and Node.js (server routes).
 */

const COOKIE_NAME = 'steps_admin_session';

/** Encode a string as UTF-8 bytes */
function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

/** Import a raw HMAC-SHA256 key from a string secret */
async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/** Base64url-encode a buffer without padding */
function toBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let str = '';
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/** Decode a base64url string to bytes */
function fromBase64Url(str: string): Uint8Array {
  const b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/** Verify a session token using Web Crypto API (Edge-safe) */
export async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [data, sig] = parts;
    if (!data || !sig) return false;

    const key = await importKey(secret);
    const sigBytes = fromBase64Url(sig);
    const isValid = await crypto.subtle.verify('HMAC', key, sigBytes, enc(data));
    if (!isValid) return false;

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(data)));
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return false;
    if (payload.role !== 'admin') return false;

    return true;
  } catch {
    return false;
  }
}

/** Create a session token using Web Crypto API (Edge-safe) */
export async function createTokenEdge(secret: string): Promise<string> {
  const key = await importKey(secret);
  // jti: random 8 hex chars
  const jtiBytes = new Uint8Array(4);
  crypto.getRandomValues(jtiBytes);
  const jti = Array.from(jtiBytes).map(b => b.toString(16).padStart(2, '0')).join('');

  const now = Date.now();
  const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 1000; // 24 hours in ms
  const payload = { role: 'admin', iat: now, exp: now + SESSION_MAX_AGE_MS, jti };
  const data = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  const sigBuffer = await crypto.subtle.sign('HMAC', key, enc(data));
  const sig = toBase64Url(sigBuffer);
  return `${data}.${sig}`;
}

export { COOKIE_NAME };
