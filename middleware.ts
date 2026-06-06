import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Routes that require authentication (non-dashboard)
const protectedRoutes = ["/account", "/checkout", "/orders"];
// Routes that redirect already-logged-in users away (auth pages)
const authRoutes = ["/auth/login", "/auth/register", "/admin-login"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ── Dashboard: ADMIN-only ─────────────────────────────────────────────
    if (pathname.startsWith("/dashboard")) {
      // Not logged in → go sign in
      if (!token) {
        return NextResponse.redirect(new URL("/admin-login", req.url));
      }
      // Logged in but not ADMIN → forbidden; admin-login page will sign them out
      if (token.role !== "ADMIN") {
        return NextResponse.redirect(
          new URL("/admin-login?reason=forbidden", req.url),
        );
      }
      return NextResponse.next();
    }

    // ── Auth page redirects ───────────────────────────────────────────────
    if (token && authRoutes.some((r) => pathname.startsWith(r))) {
      // ADMIN visiting /admin-login → send them to the dashboard
      if (pathname.startsWith("/admin-login") && token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      // Non-admin visiting /admin-login (e.g. after forbidden redirect) → let
      // the page handle signing them out; do NOT loop-redirect to "/"
      if (pathname.startsWith("/admin-login")) {
        return NextResponse.next();
      }
      // Any logged-in user visiting other auth pages → home
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Always allow auth pages (middleware fn handles redirects if needed)
        if (authRoutes.some((r) => pathname.startsWith(r))) return true;

        // Dashboard: always pass to middleware fn — it handles auth + role
        if (pathname.startsWith("/dashboard")) return true;

        // Other protected routes require any valid session
        if (protectedRoutes.some((r) => pathname.startsWith(r))) {
          return !!token;
        }

        // All other routes are public
        return true;
      },
    },
    pages: {
      signIn: "/admin-login",
    },
  },
);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
