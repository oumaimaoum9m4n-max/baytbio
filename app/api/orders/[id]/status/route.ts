import { NextResponse } from "next/server";
import { orderRouter } from "@/features/orders/actions/order.router";
import { CustomAPIError } from "@/errors";
import type { OrderStatus } from "@/features/orders/types/order";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const { status } = (await req.json()) as { status: OrderStatus };
    const result = await orderRouter.updateStatus(id, status);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[PATCH /api/orders/:id/status]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la mise à jour du statut." },
      { status: 500 },
    );
  }
}
