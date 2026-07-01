"use client";

import { useMemo, useState } from "react";
import type { SelectableDeliveryDate } from "@/features/delivery/types/delivery";

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

/** Monday-first weekday headers, matching the fr locale week start. */
const WEEKDAY_HEADERS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

type YearMonth = { year: number; month: number }; // month is 1-indexed

const parseISO = (iso: string): { year: number; month: number; day: number } => {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month, day };
};

const toISO = (year: number, month: number, day: number) =>
  `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** Monday-based column index (Mon = 0 … Sun = 6) for a calendar date. */
const mondayIndex = (year: number, month: number, day: number) => {
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay(); // Sun = 0
  return (weekday + 6) % 7;
};

const compareYM = (a: YearMonth, b: YearMonth) =>
  a.year !== b.year ? a.year - b.year : a.month - b.month;

const addMonth = ({ year, month }: YearMonth, delta: number): YearMonth => {
  const zero = year * 12 + (month - 1) + delta;
  return { year: Math.floor(zero / 12), month: (zero % 12) + 1 };
};

interface DeliveryCalendarProps {
  /** Currently selected date as ISO "YYYY-MM-DD", or null. */
  value: string | null;
  onChange: (iso: string) => void;
  /** The only dates the customer is allowed to pick. */
  selectableDates: SelectableDeliveryDate[];
  hasError?: boolean;
}

export default function DeliveryCalendar({
  value,
  onChange,
  selectableDates,
  hasError,
}: DeliveryCalendarProps) {
  const selectableSet = useMemo(
    () => new Set(selectableDates.map((d) => d.date)),
    [selectableDates],
  );

  // Navigation is bounded to the months that actually contain selectable dates.
  const { minMonth, maxMonth } = useMemo(() => {
    const first = parseISO(selectableDates[0].date);
    const last = parseISO(selectableDates[selectableDates.length - 1].date);
    return {
      minMonth: { year: first.year, month: first.month },
      maxMonth: { year: last.year, month: last.month },
    };
  }, [selectableDates]);

  const [visible, setVisible] = useState<YearMonth>(() =>
    value
      ? (() => {
          const v = parseISO(value);
          return { year: v.year, month: v.month };
        })()
      : minMonth,
  );

  const canPrev = compareYM(visible, minMonth) > 0;
  const canNext = compareYM(visible, maxMonth) < 0;

  const daysInMonth = new Date(
    Date.UTC(visible.year, visible.month, 0),
  ).getUTCDate();
  const leadingBlanks = mondayIndex(visible.year, visible.month, 1);

  const cells: (number | null)[] = [
    ...Array(leadingBlanks).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div
      className={`inline-block w-full max-w-[340px] rounded-[8px] border-[1.5px] bg-white px-4 py-3.5 shadow-[0_4px_20px_rgba(28,18,8,0.06)] ${
        hasError ? "border-[#B85A28]" : "border-[#EBD9B8]"
      }`}
    >
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          aria-label="Mois précédent"
          disabled={!canPrev}
          onClick={() => setVisible((v) => addMonth(v, -1))}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A6648] transition-colors duration-200 hover:bg-[#F5EDD8] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="font-cormorant text-[1.15rem] font-normal text-[#1C1208]">
          {MONTHS_FR[visible.month - 1]} {visible.year}
        </span>

        <button
          type="button"
          aria-label="Mois suivant"
          disabled={!canNext}
          onClick={() => setVisible((v) => addMonth(v, 1))}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#7A6648] transition-colors duration-200 hover:bg-[#F5EDD8] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Weekday headers */}
      <div className="mb-1 grid grid-cols-7">
        {WEEKDAY_HEADERS.map((wd) => (
          <span
            key={wd}
            className="flex h-8 items-center justify-center text-[0.68rem] font-medium uppercase tracking-[0.04em] text-[#A89070]"
          >
            {wd}
          </span>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) return <span key={`blank-${i}`} />;

          const iso = toISO(visible.year, visible.month, day);
          const isSelectable = selectableSet.has(iso);
          const isSelected = value === iso;

          return (
            <div key={iso} className="flex items-center justify-center">
              <button
                type="button"
                disabled={!isSelectable}
                onClick={() => onChange(iso)}
                aria-pressed={isSelected}
                className={`flex h-9 w-9 items-center justify-center rounded-[7px] text-[0.82rem] transition-all duration-200 ${
                  isSelected
                    ? "bg-terracotta font-medium text-[#F5EDD8] shadow-[0_4px_12px_rgba(184,90,40,0.3)]"
                    : isSelectable
                      ? "cursor-pointer font-normal text-[#1C1208] hover:bg-[#F5EDD8]"
                      : "cursor-not-allowed font-light text-[#D6C6A8]"
                }`}
              >
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
