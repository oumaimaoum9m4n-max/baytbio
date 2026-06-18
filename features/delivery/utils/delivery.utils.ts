import type {
  GetAllDeliveryCitiesDto,
  GetAllDeliveryDaysDto,
} from "../types/delivery.dto";
import type {
  MoroccoTime,
  SelectableDeliveryDate,
  Weekday,
} from "../types/delivery";
import { WEEKDAY_LABELS } from "../types/delivery";

const MONTHS_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

const MOROCCO_TZ = "Africa/Casablanca";

/* ── DTO mappers ── */
export const toDeliveryCityDto = (doc: any): GetAllDeliveryCitiesDto => ({
  id: doc._id?.toString?.() ?? doc._id ?? "",
  cityName: doc.cityName ?? "",
  deliveryTax: doc.deliveryTax ?? 0,
  createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt ?? "",
});

export const toDeliveryDayDto = (doc: any): GetAllDeliveryDaysDto => ({
  id: doc._id?.toString?.() ?? doc._id ?? "",
  deliveryDay: doc.deliveryDay ?? 0,
  cutoffHour: doc.cutoffHour ?? 0,
  createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt ?? "",
});

/* ── Morocco time ── */

/** Derives Morocco wall-clock components from a JS Date via Intl (fallback). */
const moroccoTimeFromDate = (date: Date): MoroccoTime => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: MOROCCO_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    weekday: "short",
  }).formatToParts(date);

  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const year = Number(get("year"));
  const month = Number(get("month"));
  const day = Number(get("day"));
  let hour = Number(get("hour"));
  if (hour === 24) hour = 0; // some engines emit "24" at midnight
  const minute = Number(get("minute"));
  // Re-derive weekday from the calendar date (stable across engines).
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay() as Weekday;

  return {
    iso: `${get("year")}-${get("month")}-${get("day")}T${String(hour).padStart(2, "0")}:${get("minute")}:00+01:00`,
    year,
    month,
    day,
    hour,
    minute,
    weekday,
  };
};

/**
 * Returns the current Morocco time, fetched from an external time API
 * (worldtimeapi), falling back to a server-side Intl computation if the
 * external service is slow or unavailable.
 */
export const getMoroccoNow = async (): Promise<MoroccoTime> => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3500);
    const res = await fetch(
      "https://worldtimeapi.org/api/timezone/Africa/Casablanca",
      { signal: controller.signal, cache: "no-store" },
    );
    clearTimeout(timeout);

    if (res.ok) {
      const data = (await res.json()) as {
        datetime?: string;
        day_of_week?: number;
      };
      const m = data.datetime?.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/,
      );
      if (m) {
        const [, y, mo, d, h, mi] = m;
        const year = Number(y);
        const month = Number(mo);
        const day = Number(d);
        const weekday = (typeof data.day_of_week === "number"
          ? data.day_of_week
          : new Date(Date.UTC(year, month - 1, day)).getUTCDay()) as Weekday;
        return {
          iso: data.datetime!,
          year,
          month,
          day,
          hour: Number(h),
          minute: Number(mi),
          weekday,
        };
      }
    }
  } catch {
    // fall through to local computation
  }

  return moroccoTimeFromDate(new Date());
};

/* ── Selectable delivery dates ── */

const formatDateLabel = (weekday: Weekday, day: number, month: number) =>
  `${WEEKDAY_LABELS[weekday]} ${day} ${MONTHS_FR[month - 1]}`;

/**
 * Returns the two soonest selectable delivery dates.
 *
 * A configured delivery weekday produces an upcoming calendar date; that date
 * is selectable only while the cut-off (the day before, at `cutoffHour`) has
 * not passed in Morocco time. The next date is dropped once its cut-off is
 * surpassed, so the earliest selectable becomes the following delivery date.
 */
export const computeSelectableDeliveryDates = (
  days: { deliveryDay: number; cutoffHour: number }[],
  now: MoroccoTime,
  limit = 2,
): SelectableDeliveryDate[] => {
  const cutoffByWeekday = new Map<number, number>();
  for (const d of days) cutoffByWeekday.set(d.deliveryDay, d.cutoffHour);

  // Anchor "today" (Morocco) as UTC midnight for stable calendar arithmetic.
  const baseUTC = Date.UTC(now.year, now.month - 1, now.day);
  const nowMinutes = now.hour * 60 + now.minute;

  const result: SelectableDeliveryDate[] = [];
  for (let offset = 0; offset < 21 && result.length < limit; offset++) {
    const dt = new Date(baseUTC + offset * 86_400_000);
    const weekday = dt.getUTCDay() as Weekday;
    const cutoffHour = cutoffByWeekday.get(weekday);
    if (cutoffHour === undefined) continue;

    // Cut-off is the day before delivery (offset-1) at `cutoffHour`.
    const cutoffMinutes = (offset - 1) * 1440 + cutoffHour * 60;
    if (nowMinutes >= cutoffMinutes) continue; // cut-off passed → not selectable

    const day = dt.getUTCDate();
    const month = dt.getUTCMonth() + 1;
    const year = dt.getUTCFullYear();
    result.push({
      date: `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`,
      weekday,
      label: formatDateLabel(weekday, day, month),
    });
  }

  return result;
};
