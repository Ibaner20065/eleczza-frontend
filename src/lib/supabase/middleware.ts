import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });
  const redirectWithSession = (url: URL) => {
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach(({ name, value, ...options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If Supabase credentials are missing or placeholders, proceed without breaking during local dev
  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse;
  }

  let user = null;
  let supabase: ReturnType<typeof createServerClient> | null = null;

  try {
    supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    });

    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    // Graceful fallback for offline dev or mock environments
    console.warn(
      "Supabase session update skipped (mock/offline environment):",
      error,
    );
  }

  const allowedDomain =
    process.env.NEXT_PUBLIC_ALLOWED_EMAIL_DOMAIN || "@aot.edu.in";
  const { pathname } = request.nextUrl;

  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/quiz") ||
    pathname.startsWith("/leaderboard") ||
    pathname.startsWith("/results");
  const isOnboardingPath = pathname === "/team";

  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password");

  // Guard 1: Protect restricted bureau routes
  if (isProtectedPath) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirect", pathname);
      return redirectWithSession(url);
    }

    if (!user.email?.toLowerCase().endsWith(allowedDomain.toLowerCase())) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized_domain");
      return redirectWithSession(url);
    }

    if (!supabase) return supabaseResponse;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, agency_id")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error(
        "Unable to check the user's onboarding profile:",
        profileError,
      );
      if (!isOnboardingPath) {
        const url = request.nextUrl.clone();
        url.pathname = "/team";
        url.searchParams.set("setup", "profile-unavailable");
        return redirectWithSession(url);
      }
    } else if ((!profile || !profile.agency_id) && !isOnboardingPath) {
      const url = request.nextUrl.clone();
      url.pathname = "/team";
      return redirectWithSession(url);
    }
  }

  // Guard 2: Redirect logged-in inspectors away from auth pages to their study
  if (
    isAuthPath &&
    user &&
    user.email?.toLowerCase().endsWith(allowedDomain.toLowerCase()) &&
    !(
      pathname === "/login" &&
      request.nextUrl.searchParams.get("verified") === "1"
    )
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return redirectWithSession(url);
  }

  return supabaseResponse;
}
