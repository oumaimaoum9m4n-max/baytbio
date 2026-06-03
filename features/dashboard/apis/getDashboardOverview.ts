import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type {
  DashboardPeriod,
  GetDashboardOverviewDto,
} from "../types/dashboard.dto";

export const getDashboardOverview = async (
  period: DashboardPeriod,
): Promise<GetDashboardOverviewDto> => {
  const res = await customFetch.get(`/api/dashboard?period=${period}`);
  return res.data;
};

export const useGetDashboardOverview = (period: DashboardPeriod) => {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: () => getDashboardOverview(period),
  });
};
