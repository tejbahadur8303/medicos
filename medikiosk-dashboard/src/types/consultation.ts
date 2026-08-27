export interface DoctorNote {
  patientId: string;
  content: string;
  savedAt: string;
  status: 'draft' | 'final';
}

export interface Doctor {
  id: string;
  name: string;
  department: string;
  hospital: string;
  online: boolean;
}

export type NotificationLevel = 'priority' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  level: NotificationLevel;
  title: string;
  message: string;
  createdAt: string;
  patientId?: string;
  read?: boolean;
}
