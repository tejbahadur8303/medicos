import { AlertOctagon } from 'lucide-react';
import type { RedFlag } from '../../types/history';

export function PriorityAlert({ flags, onReview }: { flags: RedFlag[]; onReview: () => void }) {
  if (flags.length === 0) return null;

  return (
    <div className="card border-l-4 border-l-danger bg-danger-light/40 p-5">
      <div className="flex items-start gap-3">
        <AlertOctagon className="mt-0.5 shrink-0 text-danger" size={22} />
        <div className="flex-1">
          <h3 className="font-display font-semibold text-danger">🚨 Clinical Attention</h3>
          <p className="mt-1 text-sm text-ink">Potential red flags detected:</p>
          <ul className="mt-1 space-y-0.5">
            {flags.map((f) => (
              <li key={f.label} className="text-sm font-medium text-ink">
                🔴 {f.label}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-ink-soft">
            Source: {flags[0].source}. AI-generated alert. Clinical assessment required.
          </p>
        </div>
        <button onClick={onReview} className="btn-danger shrink-0">
          Review Immediately
        </button>
      </div>
    </div>
  );
}
