import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await orderRouter.getById(id);
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const result = await orderRouter.update(id, body);
  return NextResponse.json(result);
}
