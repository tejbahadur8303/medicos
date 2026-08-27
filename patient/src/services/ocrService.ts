import type { OCRResult, DocumentCategory } from "../types/document";

// Mock OCR provider standing in for a real backend OCR/AI pipeline. Swap the
// body of extractFromDocument for a real fetch() to POST /api/document/ocr
// once the Node.js backend is wired up — the return shape already matches
// what the backend contract expects.

const mockResultsByCategory: Record<DocumentCategory, OCRResult> = {
  labReport: {
    documentType: "lab_report",
    date: "2026-08-12",
    diagnoses: [],
    medications: [],
    labValues: [
      { name: "Glucose", value: "178", unit: "mg/dL", flagged: true },
      { name: "Hemoglobin", value: "10.2", unit: "g/dL", flagged: true },
    ],
  },
  prescription: {
    documentType: "prescription",
    date: "2025-11-03",
    diagnoses: [],
    medications: ["Metformin 500mg"],
    labValues: [],
  },
  dischargeSummary: {
    documentType: "discharge_summary",
    date: "2024-06-18",
    diagnoses: ["Hypertension, newly diagnosed"],
    medications: ["Amlodipine 5mg"],
    labValues: [],
  },
  scanImaging: {
    documentType: "scan_imaging",
    date: "2026-08-15",
    diagnoses: [],
    medications: [],
    labValues: [],
  },
};

function delay<T>(value: T, ms: number): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export async function runOCR(category: DocumentCategory): Promise<OCRResult> {
  // Simulated processing latency so the "Reading… Extracting… Organizing…"
  // screen has something real to show progress against.
  await delay(null, 900);
  return mockResultsByCategory[category];
}
