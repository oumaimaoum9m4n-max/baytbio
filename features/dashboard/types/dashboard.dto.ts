import type { GetAllOrdersDto } from "@/features/orders/types/order.dto";
import type { OrderStatus } from "@/features/orders/types/order";

export type DashboardPeriod = "7d" | "30d" | "90d" | "1y" | "all";

export const DASHBOARD_PERIODS: { key: DashboardPeriod; label: string }[] = [
  { key: "7d", label: "7j" },
  { key: "30d", label: "30j" },
  { key: "90d", label: "90j" },
  { key: "1y", label: "1 an" },
  { key: "all", label: "Tout" },
];

export type KpiWithDelta = {
  value: number;
  previousValue: number;
  deltaPercent: number;
};

export type DashboardKpis = {
  revenue: KpiWithDelta;
  ordersCount: KpiWithDelta;
  averageBasket: KpiWithDelta;
  activeCustomers: KpiWithDelta;
};

export type DashboardSecondaryStats = {
  deliveryRate: number;
  cancellationRate: number;
  activeProducts: number;
  totalProducts: number;
  lowStockCount: number;
};

export type RevenueEvolutionPoint = {
  date: string;
  current: number;
  previous: number;
};

export type RevenueByProductItem = {
  productId: string;
  name: string;
  total: number;
  percentage: number;
};

export type TopProductItem = {
  productId: string;
  name: string;
  unitsSold: number;
  revenue: number;
};

export type OrdersStatusTodayItem = {
  status: OrderStatus;
  count: number;
};

export type StockAlertItem = {
  productId: string;
  name: string;
  unit: string;
  stock: number;
  alertThreshold: number;
  severity: "critical" | "low" | "ok";
};

export type DashboardGreetingInfo = {
  pendingTodayCount: number;
  todayOrdersCount: number;
  lastUpdatedAt: string;
};

export type GetDashboardOverviewDto = {
  greeting: DashboardGreetingInfo;
  kpis: DashboardKpis;
  secondaryStats: DashboardSecondaryStats;
  revenueEvolution: RevenueEvolutionPoint[];
  revenueByProduct: RevenueByProductItem[];
  topProducts: TopProductItem[];
  ordersStatusToday: OrdersStatusTodayItem[];
  stockAlerts: StockAlertItem[];
  recentOrders: GetAllOrdersDto[];
};
