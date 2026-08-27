import { usePatients } from '../hooks/usePatients';
import { PatientTable } from '../components/patients/PatientTable';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export function Patients() {
  const { patients, loading, error, refetch } = usePatients();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">All Patients</h1>
        <p className="mt-1 text-sm text-ink-soft">Every patient checked in today, across all statuses.</p>
      </div>

      {loading ? (
        <Loading label="Loading patients…" />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients yet" message="Patients who complete the kiosk intake will appear here." />
      ) : (
        <PatientTable patients={patients} />
      )}
    </div>
  );
}
