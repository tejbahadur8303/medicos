import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Medication, RedFlag } from "../types/history";

interface HistoryState {
  chiefComplaint: string | null;
  chiefComplaintTranscript: string;
  answers: Record<string, string | string[]>;
  familyHistory: Record<string, boolean>;
  personalHistory: Record<string, string>;
  medications: Medication[];
  medicationStatus: "yes" | "no" | "unknown" | null;
  allergies: string[];
  allergyStatus: "none" | "medicine" | "food" | "other" | null;
  reviewOfSystems: Record<string, boolean>;
  redFlags: RedFlag[];

  setChiefComplaint: (value: string, transcript?: string) => void;
  setAnswer: (questionId: string, value: string | string[]) => void;
  setFamilyHistory: (data: Record<string, boolean>) => void;
  setPersonalHistory: (data: Record<string, string>) => void;
  setMedicationStatus: (s: "yes" | "no" | "unknown") => void;
  addMedication: (m: Medication) => void;
  removeMedication: (index: number) => void;
  setAllergyStatus: (s: "none" | "medicine" | "food" | "other") => void;
  addAllergy: (a: string) => void;
  setReviewOfSystems: (data: Record<string, boolean>) => void;
  addRedFlags: (flags: RedFlag[]) => void;
  resetHistory: () => void;
}

const initialState = {
  chiefComplaint: null,
  chiefComplaintTranscript: "",
  answers: {},
  familyHistory: {},
  personalHistory: {},
  medications: [],
  medicationStatus: null,
  allergies: [],
  allergyStatus: null,
  reviewOfSystems: {},
  redFlags: [],
};

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      ...initialState,
      setChiefComplaint: (value, transcript) =>
        set({ chiefComplaint: value, chiefComplaintTranscript: transcript ?? "" }),
      setAnswer: (questionId, value) =>
        set((s) => ({ answers: { ...s.answers, [questionId]: value } })),
      setFamilyHistory: (data) => set({ familyHistory: data }),
      setPersonalHistory: (data) =>
        set((s) => ({ personalHistory: { ...s.personalHistory, ...data } })),
      setMedicationStatus: (medicationStatus) => set({ medicationStatus }),
      addMedication: (m) => set((s) => ({ medications: [...s.medications, m] })),
      removeMedication: (index) =>
        set((s) => ({ medications: s.medications.filter((_, i) => i !== index) })),
      setAllergyStatus: (allergyStatus) => set({ allergyStatus }),
      addAllergy: (a) => set((s) => ({ allergies: [...s.allergies, a] })),
      setReviewOfSystems: (data) => set({ reviewOfSystems: data }),
      addRedFlags: (flags) =>
        set((s) => ({
          redFlags: [...s.redFlags, ...flags.filter((f) => !s.redFlags.some((r) => r.id === f.id))],
        })),
      resetHistory: () => set(initialState),
    }),
    { name: "medikiosk-patient-history" }
  )
);
