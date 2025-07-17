import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('__session')?.value;

  const protectedPaths = ['/dashboard', '/settings'];
  const isProtected = protectedPaths.some(path =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next(); }

export const config = {
  matcher: ['/add-event', '/settings/:path*'],
};
