import { NextResponse } from "next/server";
import { productRouter } from "@/features/products/actions/product.router";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const search = url.searchParams.get("s") || "";
  const sort = url.searchParams.get("sort") || "";

  const data = await productRouter.getAll({ page, size, search, sort });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const result = await productRouter.create(body);
  return NextResponse.json(result);
}
