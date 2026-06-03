import { NextRequest, NextResponse } from "next/server";
import { CustomAPIError } from "@/errors";

type RouteContext = { params: Record<string, string | string[]> };
type Handler = (req: NextRequest, ctx?: RouteContext) => Promise<NextResponse>;

/**
 * Wraps a Next.js App Router handler to catch thrown CustomAPIErrors and
 * return structured JSON error responses — no try/catch needed in controllers.
 *
 * @example
 * export const GET = asyncWrapper(async (req) => {
 *   const session = await getCurrentSession();
 *   if (!session) throw new UnauthenticatedError();
 *   return NextResponse.json({ data });
 * });
 */
export function asyncWrapper(fn: Handler): Handler {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (error: unknown) {
      if (error instanceof CustomAPIError) {
        return NextResponse.json(
          { message: error.message },
          { status: error.statusCode },
        );
      }

      console.error("[asyncWrapper] Unhandled error:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 },
      );
    }
  };
}
