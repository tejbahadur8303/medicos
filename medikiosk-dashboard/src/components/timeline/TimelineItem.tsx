import { FileText, FlaskConical, Stethoscope, ScanLine, Hospital } from 'lucide-react';
import type { TimelineEvent } from '../../types/timeline';
import { formatDate } from '../../utils/formatDate';

const typeIcon = {
  Prescription: FileText,
  'Hospital Discharge': Hospital,
  'Blood Test': FlaskConical,
  Imaging: ScanLine,
  'Current OPD Visit': Stethoscope,
};

export function TimelineItem({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const Icon = typeIcon[event.type];
  const isCurrent = event.type === 'Current OPD Visit';

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isCurrent ? 'bg-primary text-white' : 'bg-primary-light text-primary'
          }`}
        >
          <Icon size={16} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border" />}
      </div>
      <div className="pb-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{formatDate(event.date)}</p>
        <p className="font-display font-semibold text-ink">{event.label}</p>
        {event.detail && <p className="mt-0.5 text-sm text-ink-soft">{event.detail}</p>}
      </div>
    </div>
  );
}
