import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/account", "/checkout", "/orders", "/admin"];
// Routes that redirect authenticated users away (auth pages)
const authRoutes = ["/auth/login", "/auth/register", "/admin-login"];
// Admin-only routes
const adminRoutes = ["/admin"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect logged-in users away from auth pages
    if (token && authRoutes.some((r) => pathname.startsWith(r))) {
      const target =
        pathname.startsWith("/admin-login") && token.role === "ADMIN"
          ? "/dashboard"
          : "/";
      return NextResponse.redirect(new URL(target, req.url));
    }

    // Block non-admins from admin routes
    if (
      token &&
      adminRoutes.some((r) => pathname.startsWith(r)) &&
      token.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Only invoke the middleware function on protected routes.
      // Auth routes are included so we can redirect already-logged-in users.
      authorized({ token, req }) {
        const { pathname } = req.nextUrl;

        // Always allow auth pages (middleware fn handles redirect if needed)
        if (authRoutes.some((r) => pathname.startsWith(r))) return true;

        // Protected routes require a valid token
        if (protectedRoutes.some((r) => pathname.startsWith(r))) {
          return !!token;
        }

        // All other routes are public
        return true;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  },
);

export const config = {
  /*
   * Match all request paths EXCEPT:
   * - _next/static  (static files)
   * - _next/image   (image optimisation)
   * - favicon.ico
   * - public files  (images, fonts, etc.)
   * - api/auth      (NextAuth internal routes — must NOT be blocked)
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)",
  ],
};
