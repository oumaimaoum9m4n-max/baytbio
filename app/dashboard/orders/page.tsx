import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { orderRouter } from "@/features/orders/actions/order.router";
import OrdersList from "@/features/orders/components/OrdersList";

const toISODate = (date: Date) => date.toISOString().slice(0, 10);

export default async function OrdersPage() {
  const queryClient = new QueryClient();

  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const startDate = toISODate(oneMonthAgo);
  const endDate = toISODate(today);

  await queryClient.prefetchQuery({
    queryKey: ["orders", 0, 10, "", "", startDate, endDate, "default"],
    queryFn: async () => {
      const [list, kpis] = await Promise.all([
        orderRouter.getAll({
          page: 0,
          size: 10,
          search: "",
          status: "",
          startDate,
          endDate,
          sort: "default",
        }),
        orderRouter.getKpis({
          search: "",
          status: "",
          startDate,
          endDate,
        }),
      ]);
      return { ...list, kpis };
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-7">
        <OrdersList />
      </div>
    </HydrationBoundary>
  );
}
