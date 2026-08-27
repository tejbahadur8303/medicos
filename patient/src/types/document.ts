export type DocumentCategory = "prescription" | "labReport" | "dischargeSummary" | "scanImaging";

export interface LabValue {
  name: string;
  value: string;
  unit: string;
  flagged?: boolean;
}

export interface OCRResult {
  documentType: string;
  date: string;
  diagnoses: string[];
  medications: string[];
  labValues: LabValue[];
}

export interface MedicalDocument {
  id: string;
  category: DocumentCategory;
  localFileName: string;
  uploadedAt: string;
  ocrResult?: OCRResult;
  ocrStatus: "pending" | "processing" | "done" | "failed";
}
