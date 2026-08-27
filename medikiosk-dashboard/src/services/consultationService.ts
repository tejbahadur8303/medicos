import { api } from './api';
import { useDemoStore } from '../hooks/useDemoStore';

export const consultationService = {
  async saveNote(patientId: string, content: string, status: 'draft' | 'final'): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.post('/doctor/notes', { patientId, content, status });
    } catch {
      // no-op fallback — notes remain in local component/store state
    }
  },
};
