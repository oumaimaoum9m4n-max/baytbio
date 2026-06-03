import { NextResponse } from "next/server";
import { productRouter } from "@/features/products/actions/product.router";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const data = await productRouter.getById(id);
  return NextResponse.json(data);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await req.json();
  const result = await productRouter.update(id, body);
  return NextResponse.json(result);
}
