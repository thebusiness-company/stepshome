import { timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { createTokenEdge, verifyTokenEdge, COOKIE_NAME } from './admin-auth-edge';

const SESSION_MAX_AGE = 60 * 60 * 24; // 24 hours in seconds

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error('ADMIN_SECRET must be set and at least 16 characters.');
  }
  return secret;
}

export async function setAdminSession(): Promise<void> {
  const secret = getSecret();
  const token = await createTokenEdge(secret);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const secret = getSecret();
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyTokenEdge(token, secret);
  } catch {
    return false;
  }
}

export async function isAdminAuthenticatedFromRequest(request: NextRequest): Promise<boolean> {
  try {
    const secret = getSecret();
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return false;
    return verifyTokenEdge(token, secret);
  } catch {
    return false;
  }
}

/** Constant-time password comparison */
export function verifyPassword(input: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const inputBuf = Buffer.from(input.padEnd(64, '\0'));
  const expectedBuf = Buffer.from(adminPassword.padEnd(64, '\0'));
  return timingSafeEqual(inputBuf, expectedBuf);
}
