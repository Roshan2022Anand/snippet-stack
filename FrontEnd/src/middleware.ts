import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCookies } from './lib/server-utils';

// Middleware function
export async function middleware(request: NextRequest) {
  const sessionValue = await getCookies();
  const publicPages = ['/signup', '/login'];

  if (!sessionValue && !publicPages.includes(request.nextUrl.pathname))
    return NextResponse.redirect(new URL('/login', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|public|login|signup|$).*)'],
};
