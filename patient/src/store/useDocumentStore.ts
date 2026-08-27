import { create } from "zustand";
import type { MedicalDocument } from "../types/document";

interface DocumentState {
  documents: MedicalDocument[];
  addDocument: (doc: MedicalDocument) => void;
  updateDocument: (id: string, patch: Partial<MedicalDocument>) => void;
  resetDocuments: () => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  addDocument: (doc) => set((s) => ({ documents: [...s.documents, doc] })),
  updateDocument: (id, patch) =>
    set((s) => ({
      documents: s.documents.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    })),
  resetDocuments: () => set({ documents: [] }),
}));
