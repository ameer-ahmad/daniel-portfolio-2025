"use client";

import { create } from "zustand";

type ActiveProjectState = {
  /** store just the id/slug; components can look up the full project object */
  activeId: string | "exhibition-poster";

  playActive: boolean;

  setPlayActive: (active: boolean) => void;

  /** actions */
  setActiveId: (id: string) => void;

  /** reset counter - increments on every setActiveId call to detect clicks even when id doesn't change */
  resetCounter: number;

  /** quick check for highlighting */
  isActive: (id: string) => boolean;
};

export const useActiveProject = create<ActiveProjectState>()((set, get) => ({
  playActive: false,
  setPlayActive: (active) => set({ playActive: active }),
  activeId: "exhibition-poster",
  resetCounter: 0,
  setActiveId: (id) => set({ activeId: id, resetCounter: get().resetCounter + 1 }),

  isActive: (id) => get().activeId === id,
}));

/** tiny selector hooks (nice for memoization and cleaner imports) */
export const useActiveProjectId = () => useActiveProject((s) => s.activeId);
export const useSetActiveProject = () => useActiveProject((s) => s.setActiveId);
