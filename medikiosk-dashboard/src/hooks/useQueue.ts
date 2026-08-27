import { useEffect, useMemo, useState, useCallback } from 'react';
import type { Patient } from '../types/patient';
import { patientService } from '../services/patientService';

export type QueueFilter = 'all' | 'waiting' | 'priority' | 'completed' | 'needs_review';
export type QueueSort = 'priority' | 'waiting_time' | 'age' | 'token';

interface UseQueueResult {
  patients: Patient[];
  loading: boolean;
  error: string | null;
  filter: QueueFilter;
  setFilter: (f: QueueFilter) => void;
  sort: QueueSort;
  setSort: (s: QueueSort) => void;
  search: string;
  setSearch: (s: string) => void;
  refetch: () => void;
}

const priorityWeight: Record<Patient['priority'], number> = {
  priority: 0,
  review: 1,
  normal: 2,
};

export function useQueue(): UseQueueResult {
  const [all, setAll] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<QueueFilter>('all');
  const [sort, setSort] = useState<QueueSort>('priority');
  const [search, setSearch] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    patientService
      .getQueue()
      .then(setAll)
      .catch(() => setError('Unable to load patient queue.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patients = useMemo(() => {
    let list = [...all];

    if (filter === 'waiting') list = list.filter((p) => p.status === 'WAITING');
    if (filter === 'priority') list = list.filter((p) => p.priority === 'priority');
    if (filter === 'completed') list = list.filter((p) => p.status === 'COMPLETED');
    if (filter === 'needs_review') list = list.filter((p) => p.status === 'NEEDS_REVIEW');

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.token.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q),
      );
    }

    list.sort((a, b) => {
      if (sort === 'priority') return priorityWeight[a.priority] - priorityWeight[b.priority];
      if (sort === 'waiting_time') return (b.waitingSinceMinutes ?? 0) - (a.waitingSinceMinutes ?? 0);
      if (sort === 'age') return b.age - a.age;
      if (sort === 'token') return a.token.localeCompare(b.token);
      return 0;
    });

    return list;
  }, [all, filter, sort, search]);

  return { patients, loading, error, filter, setFilter, sort, setSort, search, setSearch, refetch: load };
}
