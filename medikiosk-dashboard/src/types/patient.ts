export type PatientPriority = 'normal' | 'review' | 'priority';

export type PatientStatus =
  | 'NEW'
  | 'WAITING'
  | 'PRIORITY'
  | 'IN_REVIEW'
  | 'IN_CONSULTATION'
  | 'VERIFIED'
  | 'COMPLETED'
  | 'NEEDS_REVIEW'
  | 'FAILED';

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  token: string;
  language: string;
  chiefComplaint: string;
  priority: PatientPriority;
  status: PatientStatus;
  createdAt: string;
  abhaId?: string;
  waitingSinceMinutes?: number;
  consultation?: ConsultationRecord;
}

export interface ConsultationRecord {
  startedAt?: string;
  completedAt?: string;
  doctorName?: string;
  verifiedBy?: string;
  verifiedAt?: string;
}
