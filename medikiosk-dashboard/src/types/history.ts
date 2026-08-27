export interface Medication {
  name: string;
  dosage?: string;
  frequency?: string;
  needsVerification?: boolean;
}

export interface PersonalHistory {
  tobacco?: string;
  alcohol?: string;
  physicalActivity?: string;
  diet?: string;
  sleep?: string;
}

export interface ClinicalHistory {
  chiefComplaint: string;
  historyOfPresentIllness: string[];
  pastMedicalHistory: string[];
  pastSurgicalHistory: string[];
  medications: Medication[];
  allergies: string[];
  familyHistory: string[];
  personalHistory: PersonalHistory;
  reviewOfSystems: Record<string, Record<string, boolean>>;
}

export interface AISummary {
  content: ClinicalHistory;
  confidence: number; // "history extraction confidence", never framed as diagnostic
  generatedAt: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  lastEditedBy?: string;
  lastEditedAt?: string;
}

export interface RedFlag {
  label: string;
  source: 'Patient-reported history' | 'Document extraction';
}
