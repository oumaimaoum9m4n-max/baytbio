"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DashboardPeriod } from "../types/dashboard.dto";

type DashboardPeriodContextValue = {
  period: DashboardPeriod;
  setPeriod: (period: DashboardPeriod) => void;
};

const DashboardPeriodContext =
  createContext<DashboardPeriodContextValue | null>(null);

export function DashboardPeriodProvider({
  children,
  defaultPeriod = "7d",
}: {
  children: ReactNode;
  defaultPeriod?: DashboardPeriod;
}) {
  const [period, setPeriodState] = useState<DashboardPeriod>(defaultPeriod);

  const setPeriod = useCallback(
    (next: DashboardPeriod) => setPeriodState(next),
    [],
  );

  const value = useMemo(() => ({ period, setPeriod }), [period, setPeriod]);

  return (
    <DashboardPeriodContext.Provider value={value}>
      {children}
    </DashboardPeriodContext.Provider>
  );
}

export function useDashboardPeriod() {
  const ctx = useContext(DashboardPeriodContext);
  if (!ctx) {
    throw new Error(
      "useDashboardPeriod must be used within a DashboardPeriodProvider",
    );
  }
  return ctx;
}
