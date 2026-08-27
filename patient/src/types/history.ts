export type QuestionType = "text" | "voice" | "singleChoice" | "multiChoice" | "number" | "yesNo";

export interface HistoryQuestion {
  id: string;
  question: string;
  hindiQuestion: string;
  type: QuestionType;
  options?: { en: string; hi: string; value: string }[];
  required: boolean;
  category: string;
  redFlagRule?: (answers: Record<string, string | string[]>) => boolean;
}

export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface RedFlag {
  id: string;
  label: string;
}

export interface ClinicalSummary {
  chiefComplaint: string;
  historyOfPresentIllness: string[];
  pastMedicalHistory: string[];
  medications: Medication[];
  allergies: string[];
  familyHistory: string[];
  personalHistory: Record<string, string>;
  reviewOfSystems: Record<string, string>;
  redFlags: RedFlag[];
}
