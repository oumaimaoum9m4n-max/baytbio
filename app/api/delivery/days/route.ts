import { NextResponse } from "next/server";
import { deliveryDayRouter } from "@/features/delivery/actions/deliveryDay.router";
import { CustomAPIError } from "@/errors";

export async function GET(req: Request) {
  const url = new URL(req.url);

  if (url.searchParams.get("all") === "1") {
    const data = await deliveryDayRouter.list();
    return NextResponse.json(data);
  }

  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const sort = url.searchParams.get("sort") || "";

  const data = await deliveryDayRouter.getAll({ page, size, sort });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await deliveryDayRouter.create(body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[POST /api/delivery/days]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la création du jour." },
      { status: 500 },
    );
  }
}
