import { useQuery } from "@tanstack/react-query";
import customFetch from "@/utils/custom-fetch";
import type { GetSingleUserDto } from "../types/user.dto";

export const getSingleUser = async (
  userId: string,
): Promise<GetSingleUserDto> => {
  const res = await customFetch.get(`/api/users/${userId}`);
  return res.data;
};

export const useGetSingleUser = (userId: string) => {
  return useQuery({
    queryKey: ["users", userId],
    queryFn: () => getSingleUser(userId),
    enabled: !!userId,
  });
};
