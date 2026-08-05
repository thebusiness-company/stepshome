import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/admin-auth-edge';

/**
 * Next.js Edge Middleware — runs BEFORE every matched route.
 *
 * Policy:
 *  - Public POST allowed:  /api/contact, /api/donate, /api/newsletter
 *  - Public GET allowed:   /api/gallery (public gallery listing)
 *  - /api/admin/login POST is public (unauthenticated by definition)
 *  - Everything else requires a valid admin session cookie
 */

const PUBLIC_POST_ROUTES = [
  '/api/contact',
  '/api/donate',
  '/api/newsletter',
  '/api/payment/create-order',
  '/api/payment/verify',
  '/api/payment/webhook',
];
const PUBLIC_GET_ROUTES = ['/api/gallery', '/api/girls'];

function isPublicRequest(method: string, pathname: string): boolean {
  if (method === 'POST' && PUBLIC_POST_ROUTES.includes(pathname)) return true;
  if (method === 'GET' && PUBLIC_GET_ROUTES.includes(pathname)) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // Skip non-API routes
  if (!pathname.startsWith('/api/')) return NextResponse.next();

  // Allow public endpoints
  if (isPublicRequest(method, pathname)) return NextResponse.next();

  // Allow login POST (unauthenticated by definition)
  if (pathname === '/api/admin/login' && method === 'POST') return NextResponse.next();

  // Everything else: require admin token
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret) {
    return NextResponse.json(
      { error: 'Unauthorized. Admin session required.' },
      { status: 401 }
    );
  }

  const isValid = await verifyTokenEdge(token, secret);
  if (!isValid) {
    return NextResponse.json(
      { error: 'Unauthorized. Invalid or expired session.' },
      { status: 401 }
    );
  }

  // Add header so route handlers know auth passed at edge
  const response = NextResponse.next();
  response.headers.set('x-admin-verified', 'true');
  return response;
}

export const config = {
  matcher: ['/api/:path*'],
};
