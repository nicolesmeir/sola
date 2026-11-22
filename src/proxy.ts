import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const APP_PREFIXES = ["/stylist", "/wardrobe", "/style", "/onboarding"];
const AUTH_PAGES = ["/", "/login", "/signup"];

/**
 * Refreshes the Supabase session cookie on every navigation and does the
 * optimistic auth redirects. Onboarding-step routing happens in server layouts
 * (it needs a DB read, which doesn't belong in the proxy).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return response; // not configured yet — let pages render

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        for (const { name, value } of cookiesToSet) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
        for (const [k, v] of Object.entries(headers ?? {})) response.headers.set(k, v);
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  const redirect = (to: string) => {
    const r = NextResponse.redirect(new URL(to, request.url));
    for (const c of response.cookies.getAll()) r.cookies.set(c);
    return r;
  };

  if (!signedIn && APP_PREFIXES.some((p) => pathname.startsWith(p))) {
    return redirect("/login");
  }
  if (signedIn && AUTH_PAGES.includes(pathname)) {
    return redirect("/stylist"); // app layout forwards to onboarding if unfinished
  }
  return response;
}

export const config = {
  matcher: [
    // everything except static assets and API routes (API routes check auth themselves)
    "/((?!_next/static|_next/image|api/|favicon.ico|questionnaire/|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)",
  ],
};
