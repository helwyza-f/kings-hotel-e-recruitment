import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  // Initialize the response and handle cookies
  let response = NextResponse.next();

  // If environment variables are not set, skip middleware check
  if (!hasEnvVars) {
    return response;
  }

  // Initialize Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options); // Set cookies correctly
          });
        },
      },
    }
  );

  // Fetch the authenticated user session
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // If there's an error while fetching the user or no user, check the path
  if (error) {
    console.error("Error fetching user:", error.message);
  }

  // If no user and trying to access protected `/user` or `/admin` pages, redirect to login
  if (
    !user &&
    (request.nextUrl.pathname.startsWith("/user") ||
      request.nextUrl.pathname.startsWith("/admin"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login"; // Redirect to login page
    return NextResponse.redirect(url);
  }

  // If user is authenticated and trying to access the login page, redirect to home
  if (user && request.nextUrl.pathname === "/auth/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/"; // Redirect to home page if already logged in
    return NextResponse.redirect(url);
  }

  // Check the user's role if trying to access `/admin` routes
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user role:", profileError.message);
      return NextResponse.redirect(new URL("/auth/login", request.url)); // Redirect to login if there's an error fetching the profile
    }

    // If the user is not an admin and tries to access `/admin`, redirect them
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      profile?.role !== "admin"
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/user/dashboard"; // Redirect to home if user is not an admin
      return NextResponse.redirect(url);
    }
  }

  // If everything is valid, continue with the response
  return response;
}
