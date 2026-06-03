import { OrderModel } from "@/features/orders/actions/order.model";
import { ProductModel } from "@/features/products/actions/product.model";
import "@/features/products/actions/product.model";
import { toOrderDto } from "@/features/orders/utils/order.utils";
import {
  computeDelta,
  computePeriodRange,
  periodDayCount,
} from "../utils/dashboard.utils";
import type {
  DashboardPeriod,
  GetDashboardOverviewDto,
  OrdersStatusTodayItem,
  RevenueEvolutionPoint,
  StockAlertItem,
} from "../types/dashboard.dto";
import type { OrderStatus } from "@/features/orders/types/order";

type RawTotals = {
  revenue: number;
  ordersCount: number;
  customers: string[];
};

const TOTAL_PIPELINE_HEAD = [
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "_products",
    },
  },
  {
    $addFields: {
      orderTotal: {
        $reduce: {
          input: "$items",
          initialValue: 0,
          in: {
            $add: [
              "$$value",
              {
                $let: {
                  vars: {
                    product: {
                      $arrayElemAt: [
                        {
                          $filter: {
                            input: "$_products",
                            as: "p",
                            cond: { $eq: ["$$p._id", "$$this.productId"] },
                          },
                        },
                        0,
                      ],
                    },
                  },
                  in: {
                    $multiply: [
                      "$$this.quantity",
                      { $ifNull: ["$$product.price", 0] },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

const computeTotals = async (
  match: Record<string, unknown>,
): Promise<RawTotals> => {
  const [row] = await OrderModel.aggregate([
    { $match: match },
    ...TOTAL_PIPELINE_HEAD,
    {
      $group: {
        _id: null,
        revenue: {
          $sum: {
            $cond: [
              { $in: ["$status", ["confirmed", "delivered"]] },
              "$orderTotal",
              0,
            ],
          },
        },
        ordersCount: { $sum: 1 },
        customers: { $addToSet: "$phoneNumber" },
      },
    },
  ]);
  return row ?? { revenue: 0, ordersCount: 0, customers: [] };
};

export const dashboardRouter = {
  async getOverview({
    period,
  }: {
    period: DashboardPeriod;
  }): Promise<GetDashboardOverviewDto> {
    const refDate = new Date();
    const { start, end, previousStart, previousEnd } = computePeriodRange(
      period,
      refDate,
    );

    const todayStart = new Date(refDate);
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(refDate);
    todayEnd.setHours(23, 59, 59, 999);

    const periodMatch: Record<string, unknown> =
      period === "all" ? {} : { createdAt: { $gte: start, $lte: end } };
    const previousMatch: Record<string, unknown> =
      period === "all"
        ? {}
        : { createdAt: { $gte: previousStart, $lte: previousEnd } };

    const [
      curTotals,
      prevTotals,
      todayStatusAgg,
      statusBreakdown,
      revenueByDayAgg,
      revenueByDayPreviousAgg,
      revenueByProductAgg,
      topProductsAgg,
      stockAlertsRaw,
      productCountAgg,
      recentOrdersRaw,
    ] = await Promise.all([
      computeTotals(periodMatch),
      computeTotals(previousMatch),
      OrderModel.aggregate([
        { $match: { createdAt: { $gte: todayStart, $lte: todayEnd } } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      OrderModel.aggregate([
        { $match: periodMatch },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            ...periodMatch,
            status: { $in: ["confirmed", "delivered"] },
          },
        },
        ...TOTAL_PIPELINE_HEAD,
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$orderTotal" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            ...previousMatch,
            status: { $in: ["confirmed", "delivered"] },
          },
        },
        ...TOTAL_PIPELINE_HEAD,
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            total: { $sum: "$orderTotal" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            ...periodMatch,
            status: { $in: ["confirmed", "delivered"] },
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product._id",
            name: { $first: "$product.name" },
            total: {
              $sum: { $multiply: ["$items.quantity", "$product.price"] },
            },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 5 },
      ]),
      OrderModel.aggregate([
        {
          $match: {
            ...periodMatch,
            status: { $in: ["confirmed", "delivered"] },
          },
        },
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $group: {
            _id: "$product._id",
            name: { $first: "$product.name" },
            price: { $first: "$product.price" },
            unitsSold: { $sum: "$items.quantity" },
          },
        },
        { $addFields: { revenue: { $multiply: ["$unitsSold", "$price"] } } },
        { $sort: { unitsSold: -1 } },
        { $limit: 5 },
      ]),
      ProductModel.find({
        status: "enabled",
        $expr: { $lte: ["$stock", "$alertThreshold"] },
      })
        .sort({ stock: 1 })
        .limit(8)
        .lean(),
      ProductModel.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: {
              $sum: { $cond: [{ $eq: ["$status", "enabled"] }, 1, 0] },
            },
            lowStock: {
              $sum: {
                $cond: [{ $lte: ["$stock", "$alertThreshold"] }, 1, 0],
              },
            },
          },
        },
      ]),
      OrderModel.aggregate([
        { $match: periodMatch },
        { $sort: { createdAt: -1 } },
        { $limit: 7 },
        {
          $lookup: {
            from: "products",
            localField: "items.productId",
            foreignField: "_id",
            as: "_products",
          },
        },
        {
          $addFields: {
            items: {
              $map: {
                input: "$items",
                as: "it",
                in: {
                  quantity: "$$it.quantity",
                  productId: {
                    $arrayElemAt: [
                      {
                        $filter: {
                          input: "$_products",
                          as: "p",
                          cond: { $eq: ["$$p._id", "$$it.productId"] },
                        },
                      },
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
        { $project: { _products: 0 } },
      ]),
    ]);

    /* ── KPIs ──────────────────────────────── */
    const curBasket =
      curTotals.ordersCount > 0 ? curTotals.revenue / curTotals.ordersCount : 0;
    const prevBasket =
      prevTotals.ordersCount > 0
        ? prevTotals.revenue / prevTotals.ordersCount
        : 0;

    const kpis = {
      revenue: {
        value: curTotals.revenue,
        previousValue: prevTotals.revenue,
        deltaPercent: computeDelta(curTotals.revenue, prevTotals.revenue),
      },
      ordersCount: {
        value: curTotals.ordersCount,
        previousValue: prevTotals.ordersCount,
        deltaPercent: computeDelta(
          curTotals.ordersCount,
          prevTotals.ordersCount,
        ),
      },
      averageBasket: {
        value: curBasket,
        previousValue: prevBasket,
        deltaPercent: computeDelta(curBasket, prevBasket),
      },
      activeCustomers: {
        value: curTotals.customers.length,
        previousValue: prevTotals.customers.length,
        deltaPercent: computeDelta(
          curTotals.customers.length,
          prevTotals.customers.length,
        ),
      },
    };

    /* ── Secondary stats ───────────────────── */
    const statusMap = new Map<string, number>();
    statusBreakdown.forEach((r: { _id: string; count: number }) =>
      statusMap.set(r._id, r.count),
    );
    const totalForRates =
      (statusMap.get("pending") ?? 0) +
      (statusMap.get("confirmed") ?? 0) +
      (statusMap.get("delivered") ?? 0) +
      (statusMap.get("cancelled") ?? 0);

    const prodCounts = productCountAgg[0] ?? {
      total: 0,
      active: 0,
      lowStock: 0,
    };

    const secondaryStats = {
      deliveryRate: totalForRates
        ? ((statusMap.get("delivered") ?? 0) / totalForRates) * 100
        : 0,
      cancellationRate: totalForRates
        ? ((statusMap.get("cancelled") ?? 0) / totalForRates) * 100
        : 0,
      activeProducts: prodCounts.active,
      totalProducts: prodCounts.total,
      lowStockCount: prodCounts.lowStock,
    };

    /* ── Revenue evolution ─────────────────── */
    const dayCount = periodDayCount(period);
    const evolution: RevenueEvolutionPoint[] = (() => {
      if (period === "all" || dayCount === 0) {
        return revenueByDayAgg.map((r: { _id: string; total: number }) => ({
          date: r._id,
          current: r.total,
          previous: 0,
        }));
      }

      const curMap = new Map<string, number>();
      revenueByDayAgg.forEach((r: { _id: string; total: number }) =>
        curMap.set(r._id, r.total),
      );
      const prevMap = new Map<string, number>();
      revenueByDayPreviousAgg.forEach((r: { _id: string; total: number }) =>
        prevMap.set(r._id, r.total),
      );

      const points: RevenueEvolutionPoint[] = [];
      for (let i = 0; i < dayCount; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const iso = d.toISOString().slice(0, 10);

        const prevD = new Date(previousStart);
        prevD.setDate(previousStart.getDate() + i);
        const prevIso = prevD.toISOString().slice(0, 10);

        points.push({
          date: iso,
          current: curMap.get(iso) ?? 0,
          previous: prevMap.get(prevIso) ?? 0,
        });
      }
      return points;
    })();

    /* ── Revenue by product ────────────────── */
    const totalRevByProduct = revenueByProductAgg.reduce(
      (sum: number, r: { total: number }) => sum + r.total,
      0,
    );
    const revenueByProduct = revenueByProductAgg.map(
      (r: { _id: unknown; name?: string; total: number }) => ({
        productId: String(r._id ?? ""),
        name: r.name ?? "Produit supprimé",
        total: r.total,
        percentage:
          totalRevByProduct > 0 ? (r.total / totalRevByProduct) * 100 : 0,
      }),
    );

    /* ── Top products ──────────────────────── */
    const topProducts = topProductsAgg.map(
      (r: {
        _id: unknown;
        name?: string;
        unitsSold: number;
        revenue: number;
      }) => ({
        productId: String(r._id ?? ""),
        name: r.name ?? "Produit supprimé",
        unitsSold: r.unitsSold,
        revenue: r.revenue,
      }),
    );

    /* ── Orders status today ───────────────── */
    const allTodayStatuses: OrderStatus[] = [
      "pending",
      "confirmed",
      "delivered",
      "cancelled",
    ];
    const ordersStatusToday: OrdersStatusTodayItem[] = allTodayStatuses.map(
      (status) => ({
        status,
        count:
          todayStatusAgg.find((r: { _id: string }) => r._id === status)
            ?.count ?? 0,
      }),
    );

    /* ── Stock alerts ──────────────────────── */
    const stockAlerts: StockAlertItem[] = stockAlertsRaw.map((p) => {
      const stock = (p as { stock?: number }).stock ?? 0;
      const threshold = (p as { alertThreshold?: number }).alertThreshold ?? 0;
      const severity: StockAlertItem["severity"] =
        stock === 0 ? "critical" : stock <= threshold ? "low" : "ok";
      const raw = p as { _id?: { toString(): string }; name?: string; unit?: string };
      return {
        productId: raw._id?.toString() ?? "",
        name: raw.name ?? "",
        unit: raw.unit ?? "",
        stock,
        alertThreshold: threshold,
        severity,
      };
    });

    const pendingTodayCount =
      todayStatusAgg.find((r: { _id: string }) => r._id === "pending")?.count ??
      0;
    const todayOrdersCount = todayStatusAgg.reduce(
      (sum: number, r: { count: number }) => sum + r.count,
      0,
    );

    return {
      greeting: {
        pendingTodayCount,
        todayOrdersCount,
        lastUpdatedAt: new Date().toISOString(),
      },
      kpis,
      secondaryStats,
      revenueEvolution: evolution,
      revenueByProduct,
      topProducts,
      ordersStatusToday,
      stockAlerts,
      recentOrders: recentOrdersRaw.map(toOrderDto),
    };
  },
};
