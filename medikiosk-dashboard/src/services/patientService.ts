import { api } from './api';
import type { Patient } from '../types/patient';
import { mockPatients } from '../data/mockPatients';
import { useDemoStore } from '../hooks/useDemoStore';

/**
 * Every method here tries the real backend first and falls back to
 * mock data when the request fails or when Demo Mode is explicitly
 * turned on. This keeps the dashboard fully demo-able without a
 * running Node.js backend, per the hackathon requirement.
 */
export const patientService = {
  async getAll(): Promise<Patient[]> {
    if (useDemoStore.getState().demoMode) return mockPatients;
    try {
      const res = await api.get<Patient[]>('/patients');
      return res.data;
    } catch {
      return mockPatients;
    }
  },

  async getQueue(): Promise<Patient[]> {
    if (useDemoStore.getState().demoMode) {
      return mockPatients.filter((p) => p.status !== 'COMPLETED');
    }
    try {
      const res = await api.get<Patient[]>('/patients/queue');
      return res.data;
    } catch {
      return mockPatients.filter((p) => p.status !== 'COMPLETED');
    }
  },

  async getPriority(): Promise<Patient[]> {
    if (useDemoStore.getState().demoMode) {
      return mockPatients.filter((p) => p.priority === 'priority');
    }
    try {
      const res = await api.get<Patient[]>('/patients/priority');
      return res.data;
    } catch {
      return mockPatients.filter((p) => p.priority === 'priority');
    }
  },

  async getById(id: string): Promise<Patient | undefined> {
    if (useDemoStore.getState().demoMode) {
      return mockPatients.find((p) => p.id === id);
    }
    try {
      const res = await api.get<Patient>(`/patients/${id}`);
      return res.data;
    } catch {
      return mockPatients.find((p) => p.id === id);
    }
  },

  async startConsultation(id: string, doctorName: string): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.post(`/patients/${id}/start-consultation`, { doctorName });
    } catch {
      // Silently no-op in demo/offline fallback — UI updates optimistically.
    }
  },

  async completeConsultation(id: string): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.post(`/patients/${id}/complete-consultation`);
    } catch {
      // no-op fallback
    }
  },

  async markPriority(id: string): Promise<void> {
    if (useDemoStore.getState().demoMode) return;
    try {
      await api.post(`/patients/${id}/mark-priority`);
    } catch {
      // no-op fallback
    }
  },
};
