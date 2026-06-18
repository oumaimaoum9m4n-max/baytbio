import { NextResponse } from "next/server";
import { deliveryDayRouter } from "@/features/delivery/actions/deliveryDay.router";
import { CustomAPIError } from "@/errors";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const result = await deliveryDayRouter.update(id, body);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[PUT /api/delivery/days/:id]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la mise à jour du jour." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  try {
    const result = await deliveryDayRouter.delete(id);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof CustomAPIError) {
      return NextResponse.json({ msg: err.message }, { status: err.statusCode });
    }
    console.error("[DELETE /api/delivery/days/:id]", err);
    return NextResponse.json(
      { msg: "Une erreur est survenue lors de la suppression du jour." },
      { status: 500 },
    );
  }
}
