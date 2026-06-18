import { NextResponse } from "next/server";
import { deliveryCityRouter } from "@/features/delivery/actions/deliveryCity.router";
import { CustomAPIError } from "@/errors";

export async function GET(req: Request) {
  const url = new URL(req.url);

  if (url.searchParams.get("all") === "1") {
    const data = await deliveryCityRouter.list();
    return NextResponse.json(data);
  }

  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const search = url.searchParams.get("s") || "";
  const sort = url.searchParams.get("sort") || "";

  const data = await deliveryCityRouter.getAll({ page, size, search, sort });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await deliveryCityRouter.create(body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[POST /api/delivery/cities]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la création de la ville." },
      { status: 500 },
    );
  }
}
