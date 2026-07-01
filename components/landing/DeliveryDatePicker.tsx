"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { SelectableDeliveryDate } from "@/features/delivery/types/delivery";
import DeliveryCalendar from "./DeliveryCalendar";

interface DeliveryDatePickerProps {
  /** Currently selected date as ISO "YYYY-MM-DD", or null. */
  value: string | null;
  onChange: (iso: string) => void;
  /** The only dates the customer is allowed to pick. */
  selectableDates: SelectableDeliveryDate[];
  hasError?: boolean;
}

export default function DeliveryDatePicker({
  value,
  onChange,
  selectableDates,
  hasError,
}: DeliveryDatePickerProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel = useMemo(
    () => selectableDates.find((d) => d.date === value)?.label ?? "",
    [selectableDates, value],
  );

  // Close the popover on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const triggerBase =
    "h-[50px] px-4 border-[1.5px] rounded-[3px] font-sans text-[0.88rem] bg-cream transition-all duration-[250ms] outline-none w-full flex items-center justify-between gap-3 text-left";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={`${triggerBase} ${
          hasError
            ? "border-[#B85A28] bg-[rgba(240,224,212,0.3)]"
            : open
              ? "border-[#B85A28] bg-white shadow-[0_0_0_3px_rgba(184,90,40,0.08)]"
              : "border-[#EBD9B8] hover:border-[#B85A28]"
        }`}
      >
        <span className={selectedLabel ? "text-[#1C1208]" : "text-[#A89070]"}>
          {selectedLabel || "Sélectionner une date"}
        </span>
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#B85A28"
          strokeWidth="1.8"
          className="flex-shrink-0"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+6px)] z-50 animate-fade-slide">
          <DeliveryCalendar
            value={value}
            onChange={(iso) => {
              onChange(iso);
              setOpen(false);
            }}
            selectableDates={selectableDates}
            hasError={hasError}
          />
        </div>
      )}
    </div>
  );
}
