import mongoose from "mongoose";
import { connectDB } from "@/utils/mongo-connect";

connectDB();

const DeliveryCitySchema = new mongoose.Schema(
  {
    cityName: { type: String, required: true, trim: true, unique: true },
    deliveryTax: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const DeliveryCityModel =
  mongoose.models.DeliveryCity ||
  mongoose.model("DeliveryCity", DeliveryCitySchema);
