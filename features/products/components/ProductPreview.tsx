"use client";

import { Chip, Divider } from "@heroui/react";
import { Package, AlertTriangle, Truck, Tag } from "lucide-react";
import type { GetSingleProductDto } from "../types/product.dto";
import { DELIVERY_DAY_LABELS } from "../types/product.dto";
import formatPrice from "@/utils/format-price";
import formatDate from "@/utils/format-date";

const STATUS_MAP = {
  enabled: { label: "Actif", color: "success" as const },
  disabled: { label: "Inactif", color: "default" as const },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.67rem] tracking-[0.12em] uppercase font-semibold text-[#888880] mb-3">
      {children}
    </p>
  );
}

function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-[#E8E4DC] last:border-0">
      <span className="text-[0.75rem] text-[#888880]">{label}</span>
      <span className="text-[0.8rem] font-medium text-[#2C2C2C] text-right">{value}</span>
    </div>
  );
}

type Props = { product: GetSingleProductDto };

const ProductPreview = ({ product }: Props) => {
  const status = STATUS_MAP[product.status] ?? STATUS_MAP.disabled;
  const isLowStock = product.alertThreshold > 0 && product.stock <= product.alertThreshold;

  return (
    <div className="flex flex-col gap-5" style={{ fontFamily: "DM Sans, sans-serif" }}>

      {/* ── Hero ── */}
      <div className="border border-[#E8E4DC] rounded-xl overflow-hidden bg-[#FAF8F5]">
        <div className="h-52 relative overflow-hidden bg-[#F2F7F2]">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package size={56} className="text-[#C8C8C0]" />
            </div>
          )}
        </div>
        <div className="px-4 py-3 border-t border-[#E8E4DC]">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p
                className="text-[1.05rem] font-normal text-[#2C2C2C] leading-snug"
                style={{ fontFamily: "Instrument Serif, Georgia, serif" }}
              >
                {product.name}
              </p>
              <p className="text-[0.72rem] text-[#888880] mt-0.5">{product.unit}</p>
            </div>
            <Chip
              color={status.color}
              variant="flat"
              size="sm"
              className="shrink-0 mt-0.5"
              classNames={{ content: "text-[0.65rem] font-semibold px-1.5" }}
            >
              {status.label}
            </Chip>
          </div>
        </div>
      </div>

      {/* ── Stock ── */}
      <div>
        <SectionTitle>Stock & Inventaire</SectionTitle>
        <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span
              className={`text-[2rem] font-semibold leading-none ${isLowStock ? "text-[#C44B3C]" : "text-[#2C2C2C]"}`}
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              {product.stock}
            </span>
            {isLowStock ? (
              <Chip
                size="sm"
                color="danger"
                variant="flat"
                startContent={<AlertTriangle size={11} />}
                classNames={{ content: "text-[0.65rem] font-semibold px-1" }}
              >
                Stock critique
              </Chip>
            ) : (
              <Chip
                size="sm"
                color="success"
                variant="flat"
                classNames={{ content: "text-[0.65rem] font-semibold px-1" }}
              >
                Disponible
              </Chip>
            )}
          </div>
          {product.alertThreshold > 0 && (
            <p className="text-[0.72rem] text-[#888880] font-light mt-1.5">
              Seuil d'alerte : {product.alertThreshold} unités
            </p>
          )}
        </div>
      </div>

      {/* ── Informations ── */}
      <div>
        <SectionTitle>Informations produit</SectionTitle>
        <div className="border border-[#E8E4DC] rounded-lg px-4 bg-white overflow-hidden">
          <FieldRow
            label="Prix unitaire"
            value={
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatPrice(product.price)}
              </span>
            }
          />
          <FieldRow label="Contenance / Unité" value={product.unit} />
          <FieldRow
            label="Frais de livraison"
            value={
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
                {formatPrice(product.deliveryTax)}
              </span>
            }
          />
          <FieldRow label="Date d'ajout" value={formatDate(product.createdAt)} />
        </div>
      </div>

      {/* ── Tags ── */}
      {product.tags.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Tag size={12} className="text-[#888880]" />
            <p className="text-[0.67rem] tracking-[0.12em] uppercase font-semibold text-[#888880]">Tags</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
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

      {/* ── Delivery ── */}
      {product.deliveryDays.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-3">
            <Truck size={12} className="text-[#888880]" />
            <p className="text-[0.67rem] tracking-[0.12em] uppercase font-semibold text-[#888880]">Livraison</p>
          </div>
          <div className="bg-[#FAF8F5] border border-[#E8E4DC] rounded-lg p-3.5">
            <p className="text-[0.82rem] font-medium text-[#2C2C2C] mb-2">
              {formatPrice(product.deliveryTax)} de frais
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.deliveryDays.map((day) => (
                <Chip
                  key={day}
                  size="sm"
                  color="default"
                  variant="flat"
                  classNames={{ content: "text-[0.65rem] font-medium px-1" }}
                >
                  {DELIVERY_DAY_LABELS[day]}
                </Chip>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Description ── */}
      {(product.shortDescription || product.description) && (
        <div>
          <SectionTitle>Description</SectionTitle>
          {product.shortDescription && (
            <p className="text-[0.82rem] text-[#555550] leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}
          {product.shortDescription && product.description && (
            <Divider className="bg-[#E8E4DC] my-3" />
          )}
          {product.description && (
            <p className="text-[0.82rem] text-[#555550] leading-relaxed font-light whitespace-pre-line">
              {product.description}
            </p>
          )}
        </div>
      )}

      {/* ── Related products ── */}
      {product.relatedProducts.length > 0 && (
        <div>
          <SectionTitle>Produits associés</SectionTitle>
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
                    className="w-9 h-9 rounded-md object-cover border border-[#E8E4DC] shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-md bg-[#F2F7F2] border border-[#E8E4DC] flex items-center justify-center shrink-0">
                    <Package size={14} className="text-[#888880]" />
                  </div>
                )}
                <p className="text-[0.8rem] font-medium text-[#2C2C2C]">{rp.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPreview;
