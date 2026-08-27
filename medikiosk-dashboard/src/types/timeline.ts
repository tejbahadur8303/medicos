export interface TimelineEvent {
  id: string;
  date: string;
  label: string;
  type: DocumentTimelineType;
  detail?: string;
  documentId?: string;
}

export type DocumentTimelineType =
  | 'Prescription'
  | 'Hospital Discharge'
  | 'Blood Test'
  | 'Imaging'
  | 'Current OPD Visit';
