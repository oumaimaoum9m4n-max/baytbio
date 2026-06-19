import { NextResponse } from "next/server";
import { getMoroccoNow } from "@/features/delivery/utils/delivery.utils";

export async function GET() {
  const now = await getMoroccoNow();
  return NextResponse.json(now);
}
