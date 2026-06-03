import { NextResponse } from "next/server";
import { userRouter } from "@/features/users/actions/user.router";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const search = url.searchParams.get("s") || "";
  const role = url.searchParams.get("role") || "";
  const sort = url.searchParams.get("sort") || "";

  const data = await userRouter.getAll({ page, size, search, role, sort });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await userRouter.create(body);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Erreur inattendue";
    return NextResponse.json({ msg }, { status: 400 });
  }
}
