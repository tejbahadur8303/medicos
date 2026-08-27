export type Language = "en" | "hi";
export type Gender = "Male" | "Female" | "Other";

export interface Patient {
  name: string;
  age: number | null;
  gender: Gender | null;
  mobile: string;
  abhaId?: string;
  language: Language;
  isGuest: boolean;
}

export interface ConsentState {
  given: boolean;
  timestamp: string | null;
}
