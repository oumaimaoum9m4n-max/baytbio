import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const ids = Array.isArray(body?.ids)
      ? (body.ids as unknown[]).filter((id): id is string => typeof id === "string")
      : [];

    const data = await orderRouter.getByIds(ids);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[POST /api/orders/by-ids]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors du chargement des commandes." },
      { status: 500 },
    );
  }
}
