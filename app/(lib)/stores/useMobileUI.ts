"use client";

import { create } from "zustand";

type MobileUIState = {
  isIndexOpen: boolean;
  setIsIndexOpen: (open: boolean) => void;
  toggleIndex: () => void;
  isProjectInfoOpen: boolean;
  setIsProjectInfoOpen: (open: boolean) => void;
  toggleProjectInfo: () => void;
  currentPlayIndex: number;
  setCurrentPlayIndex: (index: number) => void;
};

export const useMobileUI = create<MobileUIState>()((set, get) => ({
  isIndexOpen: false,
  setIsIndexOpen: (open) => set({ isIndexOpen: open }),
  toggleIndex: () => set({ isIndexOpen: !get().isIndexOpen }),
  isProjectInfoOpen: false,
  setIsProjectInfoOpen: (open) => set({ isProjectInfoOpen: open }),
  toggleProjectInfo: () => set({ isProjectInfoOpen: !get().isProjectInfoOpen }),
  currentPlayIndex: 0,
  setCurrentPlayIndex: (index) => set({ currentPlayIndex: index }),
}));
