import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { dashboardRouter } from "@/features/dashboard/actions/dashboard.router";
import { DashboardPeriodProvider } from "@/features/dashboard/components/DashboardPeriodContext";
import DashboardSubHeader from "@/features/dashboard/components/DashboardSubHeader";
import DashboardGreeting from "@/features/dashboard/components/DashboardGreeting";
import DashboardOverview from "@/features/dashboard/components/DashboardOverview";
import { getCurrentSession } from "@/utils/session";

const DEFAULT_PERIOD = "7d" as const;

export default async function DashboardHomePage() {
  const [session, queryClient] = await Promise.all([
    getCurrentSession(),
    Promise.resolve(new QueryClient()),
  ]);

  await queryClient.prefetchQuery({
    queryKey: ["dashboard", DEFAULT_PERIOD],
    queryFn: () => dashboardRouter.getOverview({ period: DEFAULT_PERIOD }),
  });

  const fullName = session?.user?.name ?? "Admin";
  const firstName = fullName.split(" ")[0] ?? fullName;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardPeriodProvider defaultPeriod={DEFAULT_PERIOD}>
        <div className="flex flex-col gap-6 mt-7">
          {/* ── Page sub-header: title + period filter + actions ── */}
          <DashboardSubHeader />

          {/* ── Greeting hero card ── */}
          <DashboardGreeting userName={firstName} />

          {/* ── All the dashboard cards ── */}
          <DashboardOverview />
        </div>
      </DashboardPeriodProvider>
    </HydrationBoundary>
  );
}
