import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const token = req.cookies.get('__session')?.value;
//   const protectedPaths = ['/add-event', '/events'];

//   if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/add-event', '/events/:path*'],
// };
export function middleware() {
  return NextResponse.next();
}