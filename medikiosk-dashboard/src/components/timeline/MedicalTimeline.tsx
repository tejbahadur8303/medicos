import type { TimelineEvent } from '../../types/timeline';
import { TimelineItem } from './TimelineItem';
import { EmptyState } from '../common/EmptyState';

export function MedicalTimeline({ events }: { events: TimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState title="No medical history timeline yet" message="Documents added by the patient will appear here in chronological order." />;
  }

  const sorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="card p-6">
      <h2 className="mb-5 font-display text-lg font-semibold text-ink">Medical Timeline</h2>
      <div>
        {sorted.map((event, i) => (
          <TimelineItem key={event.id} event={event} isLast={i === sorted.length - 1} />
        ))}
      </div>
    </div>
  );
}
