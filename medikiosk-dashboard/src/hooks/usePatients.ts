import { useEffect, useState, useCallback } from 'react';
import type { Patient } from '../types/patient';
import { patientService } from '../services/patientService';

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePatients(): UsePatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    patientService
      .getAll()
      .then(setPatients)
      .catch(() => setError('Unable to load patients.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { patients, loading, error, refetch: load };
}
