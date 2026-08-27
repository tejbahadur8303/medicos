import type { MedicalDocument } from '../types/document';
import type { TimelineEvent } from '../types/timeline';

export const mockDocumentsByPatientId: Record<string, MedicalDocument[]> = {
  'MK-1024': [
    {
      id: 'doc-1',
      type: 'Lab Report',
      title: 'Blood Report',
      date: '2026-08-12',
      fileUrl: '/mock-documents/blood-report.jpg',
      extractedData: {
        fields: [
          { label: 'Glucose', value: '178', unit: 'mg/dL', confidence: 'high', flagged: true },
          { label: 'Hemoglobin', value: '10.2', unit: 'g/dL', confidence: 'high', flagged: true },
          { label: 'WBC Count', value: '7,200', unit: '/µL', confidence: 'high' },
        ],
      },
    },
    {
      id: 'doc-2',
      type: 'Prescription',
      title: 'Prescription — General Physician',
      date: '2025-11-03',
      fileUrl: '/mock-documents/prescription.jpg',
      extractedData: {
        fields: [
          { label: 'Medication', value: 'Metfor...', confidence: 'low' },
          { label: 'Dosage', value: '500mg', confidence: 'high' },
        ],
        diagnosesNoted: ['Type 2 Diabetes — noted'],
        medicationsNoted: ['Metformin 500mg — once daily'],
      },
    },
    {
      id: 'doc-3',
      type: 'Discharge Summary',
      title: 'Hospital Discharge Summary',
      date: '2024-06-18',
      fileUrl: '/mock-documents/discharge.jpg',
      extractedData: {
        fields: [{ label: 'Reason for admission', value: 'Observation for chest pain', confidence: 'high' }],
        diagnosesNoted: ['Chest pain — ruled out for acute event'],
      },
    },
  ],
  'MK-1026': [
    {
      id: 'doc-4',
      type: 'Imaging Report',
      title: 'Chest X-Ray Report',
      date: '2026-08-15',
      fileUrl: '/mock-documents/xray.jpg',
      extractedData: {
        fields: [{ label: 'Impression', value: 'Mild hyperinflation', confidence: 'high' }],
      },
    },
  ],
};

export const mockTimelineByPatientId: Record<string, TimelineEvent[]> = {
  'MK-1024': [
    { id: 't1', date: '2024-06-18', label: 'Hospital Discharge', type: 'Hospital Discharge', detail: 'Chest pain — ruled out for acute event', documentId: 'doc-3' },
    { id: 't2', date: '2025-11-03', label: 'Prescription', type: 'Prescription', detail: 'Metformin 500mg started', documentId: 'doc-2' },
    { id: 't3', date: '2026-08-12', label: 'Blood Test', type: 'Blood Test', detail: 'Glucose 178 mg/dL — flagged', documentId: 'doc-1' },
    { id: 't4', date: '2026-08-22', label: 'Current OPD Visit', type: 'Current OPD Visit', detail: 'Chest pain since yesterday' },
  ],
  'MK-1026': [
    { id: 't5', date: '2026-08-15', label: 'Imaging', type: 'Imaging', detail: 'Chest X-ray — mild hyperinflation', documentId: 'doc-4' },
    { id: 't6', date: '2026-08-22', label: 'Current OPD Visit', type: 'Current OPD Visit', detail: 'Breathing problem' },
  ],
};
