import { create } from "zustand";

interface DemoStore {
  demoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (value: boolean) => void;
}

/**
 * Demo Mode is OFF because the real backend is available.
 */
export const useDemoStore = create<DemoStore>((set) => ({
  demoMode: false,

  toggleDemoMode: () =>
    set((s) => ({
      demoMode: !s.demoMode,
    })),

  setDemoMode: (value) =>
    set({
      demoMode: value,
    }),
}));
