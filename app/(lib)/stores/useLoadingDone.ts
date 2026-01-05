"use client";

import { create } from "zustand";

type LoadingDoneState = {
  loadingDone: boolean;

  setLoadingDone: (done: boolean) => void;
};

export const useLoadingDone = create<LoadingDoneState>()((set) => ({
  loadingDone: false,
  setLoadingDone: (done) => set({ loadingDone: done }),
}));
