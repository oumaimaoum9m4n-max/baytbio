import mongoose from "mongoose";
import { connectDB } from "@/utils/mongo-connect";
import { generateOrderId } from "../utils/order.utils";

connectDB();

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    _id: { type: String, default: generateOrderId },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, default: "" },
    fullAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    items: { type: [OrderItemSchema], default: [] },
  },
  { timestamps: true, _id: false },
);

OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: 1 });

export const OrderModel =
  mongoose.models.Order || mongoose.model("Order", OrderSchema);
