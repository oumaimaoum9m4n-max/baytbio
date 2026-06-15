"use client";

import { Chip, Divider } from "@heroui/react";
import { Package, Truck, Tag, AlertTriangle } from "lucide-react";
import type { GetSingleProductDto } from "../types/product.dto";
import formatPrice from "@/utils/format-price";
import formatDate from "@/utils/format-date";

const STATUS_MAP = {
  enabled: { label: "Actif", color: "success" as const },
  disabled: { label: "Inactif", color: "default" as const },
};

type Props = { product: GetSingleProductDto };

const ProductDetails = ({ product }: Props) => {
  const status = STATUS_MAP[product.status] ?? STATUS_MAP.disabled;
  const isLowStock =
    product.alertThreshold > 0 && product.stock <= product.alertThreshold;

  return (
    <div className="grid grid-cols-[1fr_300px] gap-6" style={{ fontFamily: "DM Sans, sans-serif" }}>
      {/* ── Left ── */}
      <div className="flex flex-col gap-5">
        {/* Images */}
        {product.images.length > 0 && (
          <div className="bg-white border border-[#E8E4DC] rounded-xl overflow-hidden shadow-sm">
            <div className="h-72 relative overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="p-3 flex gap-2 overflow-x-auto">
                {product.images.slice(1).map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt=""
                    className="w-16 h-16 rounded-lg object-cover border border-[#E8E4DC] flex-shrink-0"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
          <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880] mb-1">
            Description courte
          </p>
          <p className="text-[0.85rem] text-[#555550] font-light leading-relaxed mb-4">
            {product.shortDescription || "—"}
          </p>

          {product.description && (
            <>
              <Divider className="bg-[#E8E4DC] mb-4" />
              <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880] mb-1">
                Description complète
              </p>
              <p className="text-[0.85rem] text-[#555550] font-light leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </>
          )}
        </div>

        {/* Tags */}
        {product.tags.length > 0 && (
          <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Tag size={14} className="text-[#888880]" />
              <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880]">
                Tags
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Chip
                  key={tag}
                  size="sm"
                  color="primary"
                  variant="flat"
                  classNames={{ content: "text-[0.72rem] font-medium px-1" }}
                >
                  {tag}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {/* Related products */}
        {product.relatedProducts.length > 0 && (
          <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
            <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880] mb-3">
              Produits associés
            </p>
            <div className="flex flex-col gap-2">
              {product.relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg border border-[#E8E4DC] bg-[#FAF8F5]"
                >
                  {rp.mainImage ? (
                    <img
                      src={rp.mainImage}
                      alt={rp.name}
                      className="w-10 h-10 rounded-lg object-cover border border-[#E8E4DC] flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-[#F2F7F2] border border-[#E8E4DC] flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-[#888880]" />
                    </div>
                  )}
                  <p className="text-[0.82rem] font-medium text-[#2C2C2C]">
                    {rp.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Right ── */}
      <div className="flex flex-col gap-4">
        {/* Core info */}
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-start justify-between gap-2 mb-3">
            <h2
              className="text-[1.4rem] font-normal text-[#2C2C2C] leading-tight"
              style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
            >
              {product.name}
            </h2>
            <Chip
              color={status.color}
              variant="flat"
              size="sm"
              classNames={{ content: "text-[0.65rem] font-semibold px-1.5" }}
            >
              {status.label}
            </Chip>
          </div>

          <p className="text-[0.75rem] text-[#888880] mb-4">{product.unit}</p>

          <div
            className="text-[1.6rem] font-semibold text-[#2C2C2C] mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {formatPrice(product.price)}
          </div>

          <p className="text-[0.7rem] text-[#888880] font-light">
            Ajouté le {formatDate(product.createdAt)}
          </p>
        </div>

        {/* Stock */}
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Package size={14} className="text-[#888880]" />
            <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880]">
              Stock
            </p>
          </div>
          <div className="flex items-center justify-between">
            <span
              className={`text-[1.4rem] font-semibold ${isLowStock ? "text-[#C44B3C]" : "text-[#2C2C2C]"}`}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {product.stock}
            </span>
            {isLowStock && (
              <Chip
                size="sm"
                color="danger"
                variant="flat"
                startContent={<AlertTriangle size={11} />}
                classNames={{ content: "text-[0.65rem] font-semibold px-1" }}
              >
                Stock critique
              </Chip>
            )}
          </div>
          {product.alertThreshold > 0 && (
            <p className="text-[0.72rem] text-[#888880] font-light mt-1">
              Seuil d'alerte : {product.alertThreshold}
            </p>
          )}
        </div>

        {/* Delivery */}
        <div className="bg-white border border-[#E8E4DC] rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Truck size={14} className="text-[#888880]" />
            <p className="text-[0.7rem] tracking-[0.1em] uppercase font-semibold text-[#888880]">
              Livraison
            </p>
          </div>
          <p className="text-[0.82rem] font-medium text-[#2C2C2C]">
            {formatPrice(product.deliveryTax)} de frais
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
