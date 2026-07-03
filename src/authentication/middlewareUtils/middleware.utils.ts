import { NextResponse } from 'next/server';

export function isPublicRoute(pathname: string) {
  return ['/signin'].includes(pathname);
}

export function redirectToSignIn(nextUrl: URL) {
  console.log("TEST")
  return NextResponse.redirect(new URL('/signin', nextUrl.origin));
}