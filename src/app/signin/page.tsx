import Link from "next/link";

type SignInPageProps = {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
};

function getAppBasePath(): string {
  const value = process.env.NEXT_PUBLIC_APP_BASE_PATH;

  if (!value || value.trim() === "") {
    return "/ITPortal";
  }

  const trimmed = value.trim();

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function getAuthBasePath(): string {
  const value = process.env.NEXT_PUBLIC_AUTH_BASE_PATH;

  if (!value || value.trim() === "") {
    return `${getAppBasePath()}/api/auth`;
  }

  const trimmed = value.trim();

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = searchParams ? await searchParams : undefined;

  const appBasePath = getAppBasePath();
  const authBasePath = getAuthBasePath();

  const callbackUrl =
    params?.callbackUrl && params.callbackUrl.trim() !== ""
      ? params.callbackUrl
      : appBasePath;

  const signInUrl = `${authBasePath}/signin/microsoft-entra-id?callbackUrl=${encodeURIComponent(
    callbackUrl
  )}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Sign in to IT Portal
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Please sign in with your Microsoft Entra ID account to continue.
          </p>
        </div>

        <Link
          href={signInUrl}
          className="flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 shadow-sm transition hover:bg-gray-50"
        >
          Sign in with Microsoft Entra ID
        </Link>

        <div className="mt-6 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
          <div>
            <strong>Auth URL:</strong> {signInUrl}
          </div>
          <div className="mt-1">
            <strong>Callback URL:</strong> {callbackUrl}
          </div>
        </div>
      </div>
    </main>
  );
}