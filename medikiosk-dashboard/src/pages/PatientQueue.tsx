import { Search } from 'lucide-react';
import { useQueue, type QueueFilter, type QueueSort } from '../hooks/useQueue';
import { PatientTable } from '../components/patients/PatientTable';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';

const filters: { key: QueueFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'waiting', label: 'Waiting' },
  { key: 'priority', label: 'Priority' },
  { key: 'needs_review', label: 'Needs Review' },
  { key: 'completed', label: 'Completed' },
];

const sorts: { key: QueueSort; label: string }[] = [
  { key: 'priority', label: 'Priority' },
  { key: 'waiting_time', label: 'Waiting time' },
  { key: 'age', label: 'Age' },
  { key: 'token', label: 'Token' },
];

export function PatientQueuePage() {
  const { patients, loading, error, filter, setFilter, sort, setSort, search, setSearch, refetch } = useQueue();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Patient Queue</h1>
        <p className="mt-1 text-sm text-ink-soft">Complete history is ready before the doctor even opens the case.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                filter === f.key ? 'bg-primary text-white' : 'bg-white text-ink-soft border border-border hover:bg-canvas'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, token, ID"
              className="input w-64 pl-9"
            />
          </div>
          <select value={sort} onChange={(e) => setSort(e.target.value as QueueSort)} className="input w-auto">
            {sorts.map((s) => (
              <option key={s.key} value={s.key}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <Loading label="Loading patient queue…" />
      ) : error ? (
        <ErrorState title="Unable to load patient queue" onRetry={refetch} />
      ) : patients.length === 0 ? (
        <EmptyState title="No patients match this view" message="Try a different filter or search term." />
      ) : (
        <PatientTable patients={patients} />
      )}
    </div>
  );
}
