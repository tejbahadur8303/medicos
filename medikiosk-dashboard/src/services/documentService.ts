import { api } from './api';
import type { MedicalDocument } from '../types/document';
import { mockDocumentsByPatientId } from '../data/mockDocuments';
import { useDemoStore } from '../hooks/useDemoStore';

export const documentService = {
  async getByPatientId(patientId: string): Promise<MedicalDocument[]> {
    if (useDemoStore.getState().demoMode) {
      return mockDocumentsByPatientId[patientId] ?? [];
    }
    try {
      const res = await api.get<MedicalDocument[]>(`/patients/${patientId}/documents`);
      return res.data;
    } catch {
      return mockDocumentsByPatientId[patientId] ?? [];
    }
  },
};
