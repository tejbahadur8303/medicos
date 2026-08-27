import { Users, Clock, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { PatientQueue } from '../components/dashboard/PatientQueue';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { PriorityCard } from '../components/dashboard/PriorityCard';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { usePatients } from '../hooks/usePatients';
import { useAppStore } from '../hooks/useAppStore';

const redFlagsByPatientId: Record<string, string[]> = {
  'MK-1024': ['Chest pain', 'Breathlessness'],
  'MK-1026': ['Breathlessness', 'Exertional symptoms'],
};

export function Dashboard() {
  const { doctor } = useAppStore();
  const { patients, loading, error, refetch } = usePatients();

  const priorityPatients = patients.filter((p) => p.priority === 'priority');
  const waiting = patients.filter((p) => p.status === 'WAITING' || p.status === 'PRIORITY').length;
  const completed = patients.filter((p) => p.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Good Morning, {doctor.name}</h1>
        <p className="mt-1 text-sm text-ink-soft">Here is today's patient overview.</p>
      </div>

      {loading ? (
        <Loading label="Loading dashboard…" />
      ) : error ? (
        <ErrorState onRetry={refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Today's Patients" value={125} icon={Users} accentClassName="bg-primary-light text-primary" />
            <StatCard label="Waiting" value={waiting} icon={Clock} accentClassName="bg-accent-light text-accent" />
            <StatCard label="Priority" value={priorityPatients.length} icon={AlertOctagon} accentClassName="bg-danger-light text-danger" />
            <StatCard label="Completed" value={completed} icon={CheckCircle2} accentClassName="bg-success-light text-success" />
          </div>

          {priorityPatients.length > 0 && (
            <div>
              <h2 className="mb-3 font-display text-lg font-semibold text-ink">🚨 Priority Patients</h2>
              <div className="space-y-3">
                {priorityPatients.map((p) => (
                  <PriorityCard key={p.id} patient={p} redFlagLabels={redFlagsByPatientId[p.id] ?? ['Clinical review recommended']} />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PatientQueue patients={patients} />
            </div>
            <RecentActivity />
          </div>
        </>
      )}
    </div>
  );
}
