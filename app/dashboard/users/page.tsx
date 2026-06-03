import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { userRouter } from "@/features/users/actions/user.router";
import UsersList from "@/features/users/components/UsersList";

export default async function UsersPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["users", 0, 10, "", "", ""],
    queryFn: () =>
      userRouter.getAll({
        page: 0,
        size: 10,
        search: "",
        role: "",
        sort: "",
      }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mt-7">
        <UsersList />
      </div>
    </HydrationBoundary>
  );
}
