export type DocumentType = 'Prescription' | 'Lab Report' | 'Discharge Summary' | 'Imaging Report';

export interface OCRField {
  label: string;
  value: string;
  unit?: string;
  confidence: 'high' | 'low';
  flagged?: boolean; // abnormal value requiring physician attention
}

export interface OCRResult {
  fields: OCRField[];
  diagnosesNoted?: string[];
  medicationsNoted?: string[];
}

export interface MedicalDocument {
  id: string;
  type: DocumentType;
  title: string;
  date: string;
  fileUrl: string;
  extractedData: OCRResult;
}
