"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type ActiveProjectState = {
  /** store just the id/slug; components can look up the full project object */
  activeId: string | "exhibition-poster";

  /** actions */
  setActiveId: (id: string) => void;

  /** quick check for highlighting */
  isActive: (id: string) => boolean;
};

export const useActiveProject = create<ActiveProjectState>()(
  persist(
    (set, get) => ({
      activeId: "exhibition-poster",
      setActiveId: (id) => set({ activeId: id }),

      isActive: (id) => get().activeId === id,
    }),
    { name: "active-project" } // persists to localStorage
  )
);

/** tiny selector hooks (nice for memoization and cleaner imports) */
export const useActiveProjectId = () => useActiveProject((s) => s.activeId);
export const useSetActiveProject = () => useActiveProject((s) => s.setActiveId);
