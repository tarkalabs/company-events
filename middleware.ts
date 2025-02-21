import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Allow static files and API routes
  if (path.startsWith('/_next') || path.startsWith('/api')) {
    return NextResponse.next();
  }

  // Get the user cookie and try to parse it
  const userCookie = request.cookies.get('user');
  let isLoggedIn = false;

  if (userCookie?.value) {
    try {
      const userData = JSON.parse(userCookie.value);
      isLoggedIn = !!userData?.id;
    } catch (error) {
      console.error('Error parsing user cookie:', error);
    }
  }

  const isAdmin = request.cookies.has('isAdmin');

  // Handle root route first
  if (path === '/' || path === '') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Handle login routes
  if (path === '/login') {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/events', request.url));
    }
    return NextResponse.next();
  }

  // Handle admin routes
  if (path.startsWith('/admin')) {
    if (path === '/admin/login') {
      if (isAdmin) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 