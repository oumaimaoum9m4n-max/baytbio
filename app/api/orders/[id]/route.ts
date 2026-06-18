import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";
import { CustomAPIError } from "@/errors";

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
  try {
    const body = await req.json();
    const result = await orderRouter.update(id, body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[PUT /api/orders/:id]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la mise à jour de la commande." },
      { status: 500 },
    );
  }
}
