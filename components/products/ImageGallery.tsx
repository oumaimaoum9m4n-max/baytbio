"use client";

import { useState } from "react";
import Image from "next/image";
import { getProductAccent } from "./utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
  accentIndex: number;
  badgeLabel?: string;
}

export default function ImageGallery({
  images,
  productName,
  accentIndex,
  badgeLabel,
}: ImageGalleryProps) {
  const thumbs = images.length > 0 ? images.slice(0, 3) : [];
  const [activeSrc, setActiveSrc] = useState(thumbs[0] ?? "");
  const accent = getProductAccent(accentIndex);

  return (
    <div className="flex flex-col gap-4 max-md:static max-md:h-auto max-md:px-6 max-md:pt-6 md:sticky md:top-20 md:h-[calc(100vh-100px)] md:pl-[72px]">
      <div className="relative min-h-[320px] flex-1 overflow-hidden rounded-[4px] max-md:min-h-[280px]">
        {activeSrc ? (
          <Image
            src={activeSrc}
            alt={productName}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-all duration-[800ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] [filter:saturate(0.88)_contrast(1.06)] hover:scale-[1.03] hover:[filter:saturate(0.98)]"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(160deg, ${accent}55, var(--color-olive))` }}
          />
        )}
        {badgeLabel && (
          <div
            className="absolute left-5 top-5 rounded-[1px] px-3.5 py-1.5 font-sans text-[0.65rem] uppercase tracking-[0.16em] text-white"
            style={{ background: `${accent}d9` }}
          >
            {badgeLabel}
          </div>
        )}
      </div>
      {thumbs.length > 1 && (
        <div className="flex h-[90px] shrink-0 gap-2.5 max-md:h-[72px]">
          {thumbs.map((src) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveSrc(src)}
              className={`relative min-h-[72px] flex-1 overflow-hidden rounded-[3px] border-2 transition-colors ${
                activeSrc === src ? "border-terracotta" : "border-transparent"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="120px"
                className={`object-cover transition-[filter] duration-300 ${
                  activeSrc === src ? "[filter:saturate(1)]" : "[filter:saturate(0.7)]"
                }`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
