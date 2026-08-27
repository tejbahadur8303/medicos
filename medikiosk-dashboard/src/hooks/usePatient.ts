import { useEffect, useState, useCallback } from 'react';
import type { Patient } from '../types/patient';
import type { AISummary } from '../types/history';
import type { MedicalDocument } from '../types/document';
import type { TimelineEvent } from '../types/timeline';
import { patientService } from '../services/patientService';
import { historyService } from '../services/historyService';
import { documentService } from '../services/documentService';

interface UsePatientResult {
  patient: Patient | undefined;
  summary: AISummary | undefined;
  documents: MedicalDocument[];
  timeline: TimelineEvent[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  setSummary: (s: AISummary) => void;
}

export function usePatient(patientId: string | undefined): UsePatientResult {
  const [patient, setPatient] = useState<Patient>();
  const [summary, setSummary] = useState<AISummary>();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!patientId) return;
    setLoading(true);
    setError(null);
    Promise.all([
      patientService.getById(patientId),
      historyService.getSummary(patientId),
      documentService.getByPatientId(patientId),
      historyService.getTimeline(patientId),
    ])
      .then(([p, s, d, t]) => {
        setPatient(p);
        setSummary(s);
        setDocuments(d);
        setTimeline(t);
      })
      .catch(() => setError('Unable to load this patient.'))
      .finally(() => setLoading(false));
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  return { patient, summary, documents, timeline, loading, error, refetch: load, setSummary };
}
