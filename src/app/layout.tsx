import type { Metadata } from "next";

import "./globals.css";

import { cookies } from "next/headers";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/authentication/auth";
import { UserData } from "@/types/User";

import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSideBar } from "@/components/appSidebar/appSidebar";
import Navbar from "@/components/navbar/navbar";

export const metadata: Metadata = {
  title: {
    default: "Sign In | IT Portal",
    template: "%s",
  },
};

type LayoutMode = "AUTHENTICATED_LAYOUT" | "UNAUTHENTICATED_LAYOUT";

function safeJson(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch (error) {
    return JSON.stringify(
      {
        error: "Cannot stringify value",
        message: error instanceof Error ? error.message : String(error),
      },
      null,
      2
    );
  }
}

function normalizeAuthBasePath(value: string | undefined): string {
  if (!value || value.trim() === "") {
    return "/api/auth";
  }

  const trimmed = value.trim();

  if (!trimmed.startsWith("/")) {
    return `/${trimmed}`;
  }

  return trimmed;
}

function DebugPanel({
  session,
  userdata,
  defaultOpen,
  routeMode,
  authBasePath,
  authError,
}: {
  session: any;
  userdata: UserData | null;
  defaultOpen: boolean;
  routeMode: LayoutMode;
  authBasePath: string;
  authError: unknown;
}) {
  const debugInfo = {
    timestamp: new Date().toISOString(),

    layout: {
      routeMode,
      defaultOpen,
      authBasePath,
    },

    auth: {
      hasSession: Boolean(session),
      hasApiError: Boolean(session?.apiError),
      hasSessionUser: Boolean(session?.user),
      hasUserDataInSession: Boolean(session?.userData),
      hasUserDataAfterMapping: Boolean(userdata),
      permissionCount: Array.isArray(userdata?.permission)
        ? userdata.permission.length
        : null,
    },

    values: {
      apiError: session?.apiError ?? null,
      sessionUser: session?.user ?? null,
      userDataUser: userdata?.user ?? null,
      userDataPermission: userdata?.permission ?? null,
    },

    authError:
      authError instanceof Error
        ? {
            name: authError.name,
            message: authError.message,
            stack: authError.stack,
          }
        : authError
          ? String(authError)
          : null,

    fullSession: session,
  };

  return (
    <div className="m-4 rounded-lg border border-red-300 bg-red-50 p-4 text-xs text-red-900 shadow">
      <div className="mb-3 text-base font-bold text-red-700">
        DEBUG AUTH / LAYOUT
      </div>

      <div className="mb-3 grid gap-1">
        <div>
          <strong>Layout Mode:</strong> {routeMode}
        </div>

        <div>
          <strong>Auth Base Path:</strong> {authBasePath}
        </div>

        <div>
          <strong>Has Session:</strong> {String(Boolean(session))}
        </div>

        <div>
          <strong>Has API Error:</strong> {String(Boolean(session?.apiError))}
        </div>

        <div>
          <strong>Has UserData:</strong> {String(Boolean(userdata))}
        </div>

        <div>
          <strong>Permission Count:</strong>{" "}
          {Array.isArray(userdata?.permission)
            ? userdata.permission.length
            : "N/A"}
        </div>
      </div>

      <details open>
        <summary className="cursor-pointer font-semibold">
          Full Debug JSON
        </summary>

        <pre className="mt-2 max-h-[500px] overflow-auto whitespace-pre-wrap rounded bg-white p-3 text-[11px] text-gray-800">
          {safeJson(debugInfo)}
        </pre>
      </details>
    </div>
  );
}

function UnauthenticatedDebugPage({
  session,
  userdata,
  defaultOpen,
  authBasePath,
  authError,
}: {
  session: any;
  userdata: UserData | null;
  defaultOpen: boolean;
  authBasePath: string;
  authError: unknown;
}) {
  const signInUrl = `${authBasePath}/signin`;
  const sessionUrl = `${authBasePath}/session`;
  const providersUrl = `${authBasePath}/providers`;
  const csrfUrl = `${authBasePath}/csrf`;

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <DebugPanel
        session={session}
        userdata={userdata}
        defaultOpen={defaultOpen}
        routeMode="UNAUTHENTICATED_LAYOUT"
        authBasePath={authBasePath}
        authError={authError}
      />

      <div className="mx-auto mt-8 max-w-3xl rounded-xl border border-gray-200 bg-white p-6 shadow">
        <h1 className="mb-3 text-xl font-semibold text-gray-900">
          IT Portal Authentication Debug
        </h1>

        <p className="mb-4 text-sm text-gray-700">
          ขณะนี้ระบบยังไม่พบ Session จาก NextAuth แปลว่ายังไม่ผ่านการ Login
          หรือ Cookie สำหรับ Session ยังไม่ถูกสร้าง
        </p>

        <div className="mb-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
          <div>
            <strong>Status:</strong> Not Authenticated
          </div>

          <div>
            <strong>auth():</strong> {session ? "Has Session" : "null"}
          </div>

          <div>
            <strong>Auth Base Path:</strong> {authBasePath}
          </div>

          <div>
            <strong>Sign In URL:</strong> {signInUrl}
          </div>

          <div>
            <strong>Session URL:</strong> {sessionUrl}
          </div>
        </div>

        <div className="mb-5 grid gap-3 sm:grid-cols-2">
          <a
            href={signInUrl}
            className="rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800"
          >
            Go to Sign In
          </a>

          <a
            href={sessionUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-gray-800 px-4 py-2 text-center text-sm font-medium text-white hover:bg-gray-900"
          >
            Check Session JSON
          </a>

          <a
            href={providersUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-purple-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-purple-800"
          >
            Check Providers
          </a>

          <a
            href={csrfUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-orange-600 px-4 py-2 text-center text-sm font-medium text-white hover:bg-orange-700"
          >
            Check CSRF
          </a>
        </div>

        <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4 text-xs text-yellow-900">
          <div className="mb-2 font-semibold">วิธีอ่านผล Debug</div>

          <ul className="list-disc space-y-1 pl-5">
            <li>
              ถ้า <code>/api/auth/session</code> ได้ 200 แต่{" "}
              <code>Has Session = false</code> แปลว่ายังไม่มี session หรือยังไม่ได้
              Login
            </li>

            <li>
              ถ้ากด <strong>Go to Sign In</strong> แล้วไม่ไป Microsoft Entra ID
              ให้ตรวจสอบ provider ใน <code>auth.config.ts</code>
            </li>

            <li>
              ถ้า Login แล้วกลับมาแต่ยังเป็น <code>session: null</code>{" "}
              ให้ตรวจสอบ Redirect URI, Cookie, AUTH_SECRET, AUTH_URL หรือ
              NEXTAUTH_URL
            </li>

            <li>
              ตอนรัน Local จาก log ของคุณ ใช้ <code>/api/auth</code>{" "}
              ไม่ใช่ <code>/ITPortal/api/auth</code>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const authBasePath = normalizeAuthBasePath(
    process.env.NEXT_PUBLIC_AUTH_BASE_PATH
  );

  let session: any = null;
  let userdata: UserData | null = null;
  let authError: unknown = null;

if (session && !session?.apiError && session?.userData) {
  userdata = session.userData as UserData;

  console.log("========== [RootLayout] START ==========");
  console.log("[RootLayout] defaultOpen:", defaultOpen);
  console.log("[RootLayouts");
    console.log("[RootLayout] userdata.user:", userdata?.user ?? null);
    console.log(
      "[RootLayout] userdata.permission count:",
      Array.isArray(userdata?.permission) ? userdata.permission.length : 0
    );
  
  } else {
    console.warn("[RootLayout] userdata not mapped");
    console.warn("[RootLayout] reason:", {
      hasSession: Boolean(session),
      hasApiError: Boolean(session?.apiError),
      hasUserData: Boolean(session?.userData),
      authError:
        authError instanceof Error
          ? authError.message
          : authError
            ? String(authError)
            : null,
    });
  }

  const routeMode: LayoutMode = userdata
    ? "AUTHENTICATED_LAYOUT"
    : "UNAUTHENTICATED_LAYOUT";

  console.log("[RootLayout] routeMode:", routeMode);
  console.log("========== [RootLayout] END ==========");

  return (
    <html lang="en" data-theme="light">
      <body className="flex min-h-screen flex-col">
        <SessionProvider basePath={authBasePath}>
          {userdata ? (
            <SidebarProvider defaultOpen={defaultOpen}>
              <AppSideBar permission={userdata.permission} />

              <main className="flex w-full flex-1 flex-col bg-gray-100">
                <Navbar user={userdata.user} />

                <DebugPanel
                  session={session}
                  userdata={userdata}
                  defaultOpen={defaultOpen}
                  routeMode={routeMode}
                  authBasePath={authBasePath}
                  authError={authError}
                />

                <div className="m-0 flex-1 lg:m-4">
                  <div className="card h-full w-full rounded-lg bg-white p-6 shadow-lg">
                    {children}
                  </div>
                </div>
              </main>
            </SidebarProvider>
          ) : (
            <UnauthenticatedDebugPage
              session={session}
              userdata={userdata}
              defaultOpen={defaultOpen}
              authBasePath={authBasePath}
              authError={authError}
            />
          )}
        </SessionProvider>
      </body>
    </html>
  );
}