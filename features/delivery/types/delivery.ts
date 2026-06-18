/** Day of week, 0 = Sunday … 6 = Saturday (matches Date.getUTCDay). */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const WEEKDAY_LABELS: Record<Weekday, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

export const WEEKDAYS: Weekday[] = [ 1, 2, 3, 4, 5, 6,0];

export type DeliveryCity = {
  id: string;
  cityName: string;
  deliveryTax: number;
  createdAt: string;
  updatedAt: string;
};

export type DeliveryDay = {
  id: string;
  /** Weekday the order is delivered (0–6). */
  deliveryDay: Weekday;
  /** Cut-off hour (0–23) on the day BEFORE delivery. */
  cutoffHour: number;
  createdAt: string;
  updatedAt: string;
};

/** Components of the current Morocco (Africa/Casablanca) wall-clock. */
export type MoroccoTime = {
  iso: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  weekday: Weekday;
};

/** A delivery date the customer can select in the order forms. */
export type SelectableDeliveryDate = {
  /** ISO calendar date "YYYY-MM-DD". */
  date: string;
  weekday: Weekday;
  /** Human label, e.g. "Mardi 24 juin". */
  label: string;
};
