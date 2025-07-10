import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { hasEnvVars } from "../utils";

export async function updateSession(request: NextRequest) {
  const response = NextResponse.next();

  if (!hasEnvVars) return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // ✅ Halaman publik — skip proteksi
  const isPublicPath =
    pathname === "/" || // root
    pathname.startsWith("/_next") || // nextjs assets
    pathname.startsWith("/images") ||
    pathname === "/favicon.ico" ||
    pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)$/);

  if (isPublicPath) {
    return response;
  }

  // ❌ Jika belum login dan halaman bukan publik, redirect ke login
  if (!user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";
    return NextResponse.redirect(loginUrl);
  }

  // 🔁 Jika sudah login tapi akses /auth/login, arahkan ke dashboard
  if (user && pathname === "/auth/login") {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = "/user/dashboard";
    return NextResponse.redirect(dashboardUrl);
  }

  // 🔐 Proteksi halaman /admin untuk role admin
  if (pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/user/dashboard";
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
