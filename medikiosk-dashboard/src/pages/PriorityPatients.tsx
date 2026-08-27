import { usePatients } from '../hooks/usePatients';
import { PatientCard } from '../components/patients/PatientCard';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { AlertOctagon } from 'lucide-react';

export function PriorityPatients() {
  const { patients, loading, error, refetch } = usePatients();
  const priority = patients.filter((p) => p.priority === 'priority');

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">🚨 Priority Patients</h1>
        <p className="mt-1 text-sm text-ink-soft">
          AI-detected patterns worth immediate clinical review. These are triage alerts, not diagnoses.
        </p>
      </div>

      {loading ? (
        <Loading label="Loading priority patients…" />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : priority.length === 0 ? (
        <EmptyState icon={<AlertOctagon size={28} />} title="No priority patients right now" message="Patients flagged by the red-flag detection service will appear here." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {priority.map((p) => (
            <PatientCard key={p.id} patient={p} />
          ))}
        </div>
      )}
    </div>
  );
}
