import { NextRequest, NextResponse } from 'next/server';
import { setAdminSession, clearAdminSession, verifyPassword } from '@/lib/admin-auth';
import { loginSchema, formatZodErrors } from '@/lib/schemas';
import { checkLoginLimit, getClientIP } from '@/lib/rate-limit';

/** Public POST — rate-limited login */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIP(request);
    const limit = checkLoginLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${Math.ceil(limit.retryAfterMs / 1000)}s.` },
        { status: 429 }
      );
    }

    const raw = await request.json();
    const result = loginSchema.safeParse(raw);
    if (!result.success) {
      return NextResponse.json({ error: formatZodErrors(result.error) }, { status: 400 });
    }

    if (!verifyPassword(result.data.password)) {
      return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
    }

    await setAdminSession();
    return NextResponse.json({ success: true, message: 'Logged in successfully.' });
  } catch (error) {
    console.error('[Admin Login] Error:', error);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}

/** Admin-only DELETE — logout */
export async function DELETE() {
  try {
    await clearAdminSession();
    return NextResponse.json({ success: true, message: 'Logged out.' });
  } catch (error) {
    console.error('[Admin Logout] Error:', error);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
