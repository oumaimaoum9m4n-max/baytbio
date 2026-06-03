import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { PaginatedData } from "@/utils/types";
import type { GetAllUsersDto } from "../types/user.dto";

export type GetAllUsersParams = {
  page: number;
  size: number;
  search: string;
  role: string;
  sort: string;
};

export const getAllUsers = async ({
  page,
  size,
  search,
  role,
  sort,
}: GetAllUsersParams): Promise<PaginatedData<GetAllUsersDto>> => {
  const qs = new URLSearchParams({
    page: String(page),
    size: String(size),
    s: search,
    role,
    sort,
  });
  const res = await customFetch.get(`/api/users?${qs.toString()}`);
  return res.data;
};

export const useGetAllUsers = (params: GetAllUsersParams) => {
  return useQuery({
    queryKey: [
      "users",
      params.page,
      params.size,
      params.search,
      params.role,
      params.sort,
    ],
    queryFn: () => getAllUsers(params),
  });
};
