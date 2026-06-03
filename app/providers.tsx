"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CartProvider } from "@/components/shared";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,
            refetchInterval: 60 * 1000,
          },
        },
      }),
  );
  return (
    <SessionProvider>
      <QueryClientProvider client={client}>
        <HeroUIProvider>
          <ToastProvider
            placement="bottom-right"
            toastOffset={16}
            maxVisibleToasts={5}
            toastProps={{
              radius: "md",
              variant: "flat",
              classNames: {
                base: "shadow-toast border border-default-200",
                title: "font-medium text-sm",
                description: "text-xs text-default-500",
              },
            }}
          />
          <CartProvider>{children}</CartProvider>
        </HeroUIProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
