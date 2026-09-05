import { create } from "zustand";
import { persist } from "zustand/middleware";

type BalanceVisibilityState = {
  isVisible: boolean;
  toggle: () => void;
};

export const useBalanceVisibilityStore = create<BalanceVisibilityState>()(
  persist(
    (set) => ({
      isVisible: true,
      toggle: () => set((s) => ({ isVisible: !s.isVisible })),
    }),
    { name: "balance-visible" },
  ),
);
