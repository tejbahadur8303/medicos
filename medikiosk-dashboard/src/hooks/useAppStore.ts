import { create } from 'zustand';
import type { Doctor, AppNotification } from '../types/consultation';

interface AppStore {
  doctor: Doctor;
  notifications: AppNotification[];
  markNotificationRead: (id: string) => void;
}

const defaultDoctor: Doctor = {
  id: 'doc-1',
  name: 'Dr. Sharma',
  department: 'General Medicine',
  hospital: 'Demo Government Hospital',
  online: true,
};

const defaultNotifications: AppNotification[] = [
  {
    id: 'n1',
    level: 'priority',
    title: 'Priority patient detected',
    message: 'Rahul Kumar has a potential red-flag symptom.',
    createdAt: '2026-08-22T08:13:00+05:30',
    patientId: 'MK-1024',
  },
  {
    id: 'n2',
    level: 'info',
    title: 'New patient history ready',
    message: "Priya Sharma's history is ready for review.",
    createdAt: '2026-08-22T08:25:00+05:30',
    patientId: 'MK-1025',
  },
  {
    id: 'n3',
    level: 'warning',
    title: 'OCR requires verification',
    message: 'Medication name could not be confidently extracted for Rahul Kumar.',
    createdAt: '2026-08-22T08:14:00+05:30',
    patientId: 'MK-1024',
  },
];

export const useAppStore = create<AppStore>((set) => ({
  doctor: defaultDoctor,
  notifications: defaultNotifications,
  markNotificationRead: (id) =>
    set((s) => ({
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    })),
}));
