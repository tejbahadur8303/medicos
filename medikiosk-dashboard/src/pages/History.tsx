import { usePatients } from '../hooks/usePatients';
import { PatientTable } from '../components/patients/PatientTable';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

export function HistoryPage() {
  const { patients, loading, error, refetch } = usePatients();
  const completed = patients.filter((p) => p.status === 'COMPLETED' || p.status === 'VERIFIED');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">History</h1>
        <p className="mt-1 text-sm text-ink-soft">Patients with a verified or completed clinical history.</p>
      </div>

      {loading ? (
        <Loading label="Loading history…" />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : completed.length === 0 ? (
        <EmptyState title="No verified histories yet" message="Once you confirm a patient's summary, it will appear here." />
      ) : (
        <PatientTable patients={completed} />
      )}
    </div>
  );
}
