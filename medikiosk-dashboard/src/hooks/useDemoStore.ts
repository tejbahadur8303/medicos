import { create } from 'zustand';

interface DemoStore {
  demoMode: boolean;
  toggleDemoMode: () => void;
  setDemoMode: (value: boolean) => void;
}

/**
 * Demo Mode is ON by default so the dashboard is immediately presentable
 * without a running backend — this is the hackathon requirement. Toggle
 * it off once a real Node.js backend is available at VITE_API_BASE_URL.
 */
export const useDemoStore = create<DemoStore>((set) => ({
  demoMode: true,
  toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
  setDemoMode: (value) => set({ demoMode: value }),
}));
