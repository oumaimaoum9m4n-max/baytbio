import { NextResponse } from "next/server";
import { dashboardRouter } from "@/features/dashboard/actions/dashboard.router";
import { isValidPeriod } from "@/features/dashboard/utils/dashboard.utils";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const raw = url.searchParams.get("period");
  const period = isValidPeriod(raw) ? raw : "7d";

  const data = await dashboardRouter.getOverview({ period });
  return NextResponse.json(data);
}
