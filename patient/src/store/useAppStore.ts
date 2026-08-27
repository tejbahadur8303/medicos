import { create } from "zustand";

interface AppState {
  demoMode: boolean;
  toggleDemoMode: () => void;
  isOnline: boolean;
  setOnline: (online: boolean) => void;
  submitted: boolean;
  patientId: string | null;
  token: string | null;
  setSubmission: (patientId: string, token: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  demoMode: true,
  toggleDemoMode: () => set((s) => ({ demoMode: !s.demoMode })),
  isOnline: typeof navigator !== "undefined" ? navigator.onLine : true,
  setOnline: (isOnline) => set({ isOnline }),
  submitted: false,
  patientId: null,
  token: null,
  setSubmission: (patientId, token) => set({ submitted: true, patientId, token }),
}));

if (typeof window !== "undefined") {
  window.addEventListener("online", () => useAppStore.getState().setOnline(true));
  window.addEventListener("offline", () => useAppStore.getState().setOnline(false));
}
