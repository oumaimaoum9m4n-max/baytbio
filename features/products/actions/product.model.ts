import mongoose from "mongoose";
import { connectDB } from "@/utils/mongo-connect";


connectDB();

const RelatedProductSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    name: String,
    mainImage: String,
  },
  { _id: false },
);

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameAr: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    description: { type: String, default: "" },
    shortDescription: { type: String, required: true },
    images: [String],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    tags: [String],
    unit: { type: String, required: true },
    alertThreshold: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "enabled",
    },
    deliveryTax: { type: Number, default: 0, min: 0 },
    relatedProducts: [RelatedProductSchema],
  },
  { timestamps: true },
);

export const ProductModel =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);
