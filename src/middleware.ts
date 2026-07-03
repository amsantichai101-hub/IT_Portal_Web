import { NextResponse } from "next/server";
import { auth } from "./authentication/auth";
import { AuthenticatedNextRequest } from "./authentication/types/middleware.types";
import { Permission } from "./types/User";
import { routeAccessConfig } from "./lib/routeAccessConfig";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

function getAppBasePath(): string {
  const value = process.env.NEXT_PUBLIC_APP_BASE_PATH;

  if (!value || value.trim() === "") {
    return "/ITPortal";
  }

  const trimmed = value.trim();

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function isAuthApiPath(pathname: string): boolean {
  return pathname.includes("/api/auth");
}

function isNextInternalPath(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.includes("/_next") ||
    pathname.endsWith("/favicon.ico")
  );
}

function buildSignInPageUrl(req: AuthenticatedNextRequest): URL {
  const appBasePath = getAppBasePath();

  const currentPath = `${req.nextUrl.pathname}${req.nextUrl.search}`;
  const signInUrl = new URL(`${appBasePath}/signin`, req.nextUrl.origin);

  signInUrl.searchParams.set("callbackUrl", currentPath);

  return signInUrl;
}

export default auth((req: AuthenticatedNextRequest) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const appBasePath = getAppBasePath();
  const homeUrl = new URL(appBasePath, nextUrl.origin);
  const errorUrl = new URL(`${appBasePath}/error`, nextUrl.origin);

  const isAuthenticated = Boolean(req.auth?.user);
  const isApiError = Boolean(req.auth?.apiError);
  const isApiFirstLoad = Boolean(req.auth?.apiFirstLoad);

  console.log("========== [Middleware] START ==========");
  console.log("[Middleware] pathname:", pathname);
  console.log("[Middleware] appBasePath:", appBasePath);
  console.log("[Middleware] isAuthenticated:", isAuthenticated);
  console.log("[Middleware] isApiError:", isApiError);
  console.log("[Middleware] isApiFirstLoad:", isApiFirstLoad);
  console.log("[Middleware] req.auth:", req.auth);

  if (isNextInternalPath(pathname)) {
    return NextResponse.next();
  }

  if (isAuthApiPath(pathname)) {
    return NextResponse.next();
  }

  if (pathname === `${appBasePath}/signin`) {
    if (isAuthenticated) {
      return NextResponse.redirect(homeUrl);
    }

    return NextResponse.next();
  }

  if (!isAuthenticated) {
    const signInUrl = buildSignInPageUrl(req);

    console.warn("[Middleware] not authenticated, redirect:", signInUrl.href);

    return NextResponse.redirect(signInUrl);
  }

  if (
    isAuthenticated &&
    isApiError &&
    !isApiFirstLoad &&
    pathname !== errorUrl.pathname
  ) {
    return NextResponse.redirect(errorUrl);
  }

  if (pathname === appBasePath || pathname === `${appBasePath}/`) {
    return NextResponse.next();
  }

  if (!isApiFirstLoad) {
    const role = req.auth?.userData?.permission as Permission | undefined;

    if (!role) {
      return NextResponse.redirect(homeUrl);
    }

    const matchedRequiredPath = routeAccessConfig.find((route) =>
      pathname.startsWith(`${appBasePath}${route.path}`)
    );

    if (!matchedRequiredPath) {
      return NextResponse.next();
    }

    const hasAccessPermission = matchedRequiredPath.roles.some(
      (permission) => role[permission] === true
    );

    if (hasAccessPermission) {
      return NextResponse.next();
    }

    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
});