import { NextResponse } from "next/server";
import { deliveryDayRouter } from "@/features/delivery/actions/deliveryDay.router";

export async function GET() {
  const data = await deliveryDayRouter.getOptions();
  return NextResponse.json(data);
}
