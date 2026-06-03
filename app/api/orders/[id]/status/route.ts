import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";
import type { OrderStatus } from "@/features/orders/types/order";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { status } = (await req.json()) as { status: OrderStatus };
  const result = await orderRouter.updateStatus(id, status);
  return NextResponse.json(result);
}
