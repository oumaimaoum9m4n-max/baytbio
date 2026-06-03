import type { DashboardPeriod } from "../types/dashboard.dto";

export const isValidPeriod = (v: string | null | undefined): v is DashboardPeriod =>
  v === "7d" || v === "30d" || v === "90d" || v === "1y" || v === "all";

export const periodDayCount = (period: DashboardPeriod): number => {
  switch (period) {
    case "7d":
      return 7;
    case "30d":
      return 30;
    case "90d":
      return 90;
    case "1y":
      return 365;
    case "all":
    default:
      return 0;
  }
};

export type PeriodRange = {
  start: Date;
  end: Date;
  previousStart: Date;
  previousEnd: Date;
};

export const computePeriodRange = (
  period: DashboardPeriod,
  refDate: Date = new Date(),
): PeriodRange => {
  const end = new Date(refDate);
  end.setHours(23, 59, 59, 999);

  if (period === "all") {
    return {
      start: new Date(0),
      end,
      previousStart: new Date(0),
      previousEnd: new Date(0),
    };
  }

  const days = periodDayCount(period);
  const start = new Date(end);
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);

  const previousEnd = new Date(start);
  previousEnd.setDate(previousEnd.getDate() - 1);
  previousEnd.setHours(23, 59, 59, 999);

  const previousStart = new Date(previousEnd);
  previousStart.setDate(previousStart.getDate() - days + 1);
  previousStart.setHours(0, 0, 0, 0);

  return { start, end, previousStart, previousEnd };
};

export const computeDelta = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const STATUS_COLOR_MAP: Record<
  "pending" | "confirmed" | "delivered" | "cancelled",
  { bg: string; border: string; text: string; dot: string; label: string }
> = {
  pending: {
    bg: "#FEF6E4",
    border: "#F2D58A",
    text: "#8C6A19",
    dot: "#C9960C",
    label: "En attente",
  },
  confirmed: {
    bg: "#E8F0F8",
    border: "#B6CCE2",
    text: "#27466A",
    dot: "#3A6B9E",
    label: "Confirmées",
  },
  delivered: {
    bg: "#E8F0E8",
    border: "#B7D2BC",
    text: "#1F4A2D",
    dot: "#2D5A3D",
    label: "Livrées",
  },
  cancelled: {
    bg: "#FAEAE8",
    border: "#EBC2BC",
    text: "#8B3026",
    dot: "#C44B3C",
    label: "Annulées",
  },
};

export const STOCK_SEVERITY_STYLE: Record<
  "critical" | "low" | "ok",
  { bg: string; border: string; pillBg: string; pillText: string; label: string }
> = {
  critical: {
    bg: "#FCEEEC",
    border: "#F4C9C2",
    pillBg: "#C44B3C",
    pillText: "#FFFFFF",
    label: "Critique",
  },
  low: {
    bg: "#FEF6E4",
    border: "#F2D58A",
    pillBg: "#D4883C",
    pillText: "#FFFFFF",
    label: "Faible",
  },
  ok: {
    bg: "#E8F0E8",
    border: "#B7D2BC",
    pillBg: "#2D5A3D",
    pillText: "#FFFFFF",
    label: "OK",
  },
};
