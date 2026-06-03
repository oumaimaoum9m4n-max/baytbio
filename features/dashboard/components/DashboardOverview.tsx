"use client";

import KpiCards from "./KpiCards";
import SecondaryStats from "./SecondaryStats";
import RevenueEvolution from "./RevenueEvolution";
import RevenueByProduct from "./RevenueByProduct";
import RecentOrders from "./RecentOrders";
import TopProducts from "./TopProducts";
import OrdersStatusToday from "./OrdersStatusToday";
import StockAlerts from "./StockAlerts";
import QuickActions from "./QuickActions";

const DashboardOverview = () => {
  return (
    <div className="flex flex-col gap-5">
      <KpiCards />
      <SecondaryStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RevenueEvolution />
        </div>
        <RevenueByProduct />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <TopProducts />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <OrdersStatusToday />
        <StockAlerts />
        <QuickActions />
      </div>
    </div>
  );
};

export default DashboardOverview;
