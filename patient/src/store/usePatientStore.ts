import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Patient, ConsentState, Language } from "../types/patient";

interface PatientState {
  patient: Patient;
  consent: ConsentState;
  setLanguage: (lang: Language) => void;
  setPatient: (patch: Partial<Patient>) => void;
  giveConsent: () => void;
  declineConsent: () => void;
  resetSession: () => void;
}

const initialPatient: Patient = {
  name: "",
  age: null,
  gender: null,
  mobile: "",
  abhaId: "",
  language: "en",
  isGuest: false,

  // Backend session details
  sessionId: "",
  token: "",
};

export const usePatientStore = create<PatientState>()(
  persist(
    (set) => ({
      patient: initialPatient,

      consent: {
        given: false,
        timestamp: null,
      },

      setLanguage: (language) =>
        set((state) => ({
          patient: {
            ...state.patient,
            language,
          },
        })),

      setPatient: (patch) =>
        set((state) => ({
          patient: {
            ...state.patient,
            ...patch,
          },
        })),

      giveConsent: () =>
        set({
          consent: {
            given: true,
            timestamp: new Date().toISOString(),
          },
        }),

      declineConsent: () =>
        set({
          consent: {
            given: false,
            timestamp: null,
          },
        }),

      resetSession: () =>
        set({
          patient: initialPatient,
          consent: {
            given: false,
            timestamp: null,
          },
        }),
    }),
    {
      name: "medikiosk-patient-session",
    },
  ),
);
