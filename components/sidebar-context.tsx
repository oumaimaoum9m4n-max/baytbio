"use client";

import { createContext, useContext } from "react";

interface SidebarContextValue {
  isCollapsed: boolean;
}

export const SidebarContext = createContext<SidebarContextValue>({
  isCollapsed: false,
});

export function useSidebarContext() {
  return useContext(SidebarContext);
}
