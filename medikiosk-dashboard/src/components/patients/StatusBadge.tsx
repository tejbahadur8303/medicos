import type { PatientStatus, PatientPriority } from '../../types/patient';
import { statusVisuals, priorityVisuals } from '../../utils/status';

export function StatusBadge({ status }: { status: PatientStatus }) {
  const v = statusVisuals[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${v.className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${v.dotClassName}`} />
      {v.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: PatientPriority }) {
  const v = priorityVisuals[priority];
  const emoji = priority === 'priority' ? '🔴' : priority === 'review' ? '🟡' : '🟢';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${v.className}`}>
      {emoji} {v.label}
    </span>
  );
}
