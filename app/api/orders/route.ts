import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";
import { CustomAPIError } from "@/errors";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const page = Number(url.searchParams.get("page") || 0);
  const size = Number(url.searchParams.get("size") || 10);
  const search = url.searchParams.get("s") || "";
  const status = url.searchParams.get("status") || "";
  const startDate = url.searchParams.get("startDate") || "";
  const endDate = url.searchParams.get("endDate") || "";
  const sort = url.searchParams.get("sort") || "";
  const withKpis = url.searchParams.get("kpis") === "1";

  const [list, kpis] = await Promise.all([
    orderRouter.getAll({ page, size, search, status, startDate, endDate, sort }),
    withKpis
      ? orderRouter.getKpis({ search, status: "", startDate, endDate })
      : Promise.resolve(null),
  ]);

  return NextResponse.json({ ...list, kpis });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await orderRouter.create(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/orders]", err);
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la création de la commande." },
      { status: 500 },
    );
  }
}
