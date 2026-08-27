import { api } from './api';
import type { AISummary } from '../types/history';
import type { TimelineEvent } from '../types/timeline';
import { mockSummaryByPatientId } from '../data/mockPatients';
import { mockTimelineByPatientId } from '../data/mockDocuments';
import { useDemoStore } from '../hooks/useDemoStore';

export const historyService = {
  async getSummary(patientId: string): Promise<AISummary | undefined> {
    if (useDemoStore.getState().demoMode) {
      return mockSummaryByPatientId[patientId];
    }
    try {
      const res = await api.get<AISummary>(`/patients/${patientId}/summary`);
      return res.data;
    } catch {
      return mockSummaryByPatientId[patientId];
    }
  },

  async updateSummary(patientId: string, summary: AISummary): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.put(`/patients/${patientId}/summary`, summary);
    } catch {
      // no-op fallback; UI already updated optimistically in the store
    }
  },

  async verify(patientId: string, doctorName: string): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.post(`/patients/${patientId}/verify`, { doctorName });
    } catch {
      // no-op fallback
    }
  },

  async getTimeline(patientId: string): Promise<TimelineEvent[]> {
    if (useDemoStore.getState().demoMode) {
      return mockTimelineByPatientId[patientId] ?? [];
    }
    try {
      const res = await api.get<TimelineEvent[]>(`/patients/${patientId}/timeline`);
      return res.data;
    } catch {
      return mockTimelineByPatientId[patientId] ?? [];
    }
  },
};
