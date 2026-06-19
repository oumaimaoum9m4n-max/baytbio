import mongoose from "mongoose";
import { connectDB } from "@/utils/mongo-connect";

connectDB();

const DeliveryDaySchema = new mongoose.Schema(
  {
    // Weekday delivered: 0 = Sunday … 6 = Saturday.
    deliveryDay: { type: Number, required: true, min: 0, max: 6, unique: true },
    // Cut-off hour (0–23) on the day before delivery.
    cutoffHour: { type: Number, required: true, min: 0, max: 23 },
  },
  { timestamps: true },
);

export const DeliveryDayModel =
  mongoose.models.DeliveryDay ||
  mongoose.model("DeliveryDay", DeliveryDaySchema);
