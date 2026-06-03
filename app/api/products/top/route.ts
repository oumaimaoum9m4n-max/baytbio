import { NextResponse } from "next/server";
import { productRouter } from "@/features/products/actions/product.router";

export async function GET() {
  const data = await productRouter.getTopProducts();
  return NextResponse.json(data);
}
