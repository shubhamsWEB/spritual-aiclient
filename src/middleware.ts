import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
// Paths that require authentication
const PROTECTED_PATHS = ['/profile', '/chat'];

// Paths that are only for non-authenticated users
const AUTH_PATHS = ['/auth/login', '/auth/register', '/auth/forgot-password'];

export async function middleware(request: NextRequest) {
  // Get the token from cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('authToken')?.value;
  
  // Get the current path
  const path = request.nextUrl.pathname;
  
  // Check if path is a protected route
  const isProtectedPath = PROTECTED_PATHS.some(protectedPath => 
    path === protectedPath || path.startsWith(`${protectedPath}/`)
  );
  
  // Check if path is an auth route (login/register)
  const isAuthPath = AUTH_PATHS.some(authPath => 
    path === authPath || path.startsWith(`${authPath}/`)
  );
  
  // If the path is protected and no token is present, redirect to login
  if (isProtectedPath && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }
  
  // If the path is for non-authenticated users (like login) and a token is present,
  // redirect to home page
  if (isAuthPath && token) {
    const redirectUrl = new URL('/', request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  // For all other routes, continue
  return NextResponse.next();
}

// Define the config with proper matcher syntax (without spread operator)
export const config = {
  matcher: [
    '/profile/:path*',
    '/chat/:path*',
    '/auth/login/:path*',
    '/auth/register/:path*',
    '/auth/forgot-password/:path*'
    // Do not include '/auth/hash-callback/:path*' here
  ]
};