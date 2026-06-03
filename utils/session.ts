import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Server-side helper — call inside Server Components, Route Handlers,
 * or Server Actions. Returns null when no session exists.
 */
export async function getCurrentSession() {
  return getServerSession(authOptions);
}
