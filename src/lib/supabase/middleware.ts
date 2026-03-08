import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes - redirect to login if not authenticated
  const protectedPaths = ["/dashboard", "/settings", "/billing", "/account", "/onboarding"];
  const isProtectedRoute = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  const authPaths = ["/login", "/signup"];
  const isAuthRoute = authPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Set user info cookies for client-side access
  if (user) {
    supabaseResponse.cookies.set("cb_user_email", user.email || "", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    supabaseResponse.cookies.set("cb_user_name", user.user_metadata?.full_name || "", { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
    supabaseResponse.cookies.set("cb_user_id", user.id, { path: "/", maxAge: 60 * 60 * 24 * 7, sameSite: "lax" });
  } else {
    // Clear cookies if not authenticated
    supabaseResponse.cookies.delete("cb_user_email");
    supabaseResponse.cookies.delete("cb_user_name");
    supabaseResponse.cookies.delete("cb_user_id");
  }

  return supabaseResponse;
}
