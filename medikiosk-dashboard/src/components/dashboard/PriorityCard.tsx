import { useNavigate } from 'react-router-dom';
import { AlertOctagon } from 'lucide-react';
import type { Patient } from '../../types/patient';
import { Button } from '../common/Button';

interface PriorityCardProps {
  patient: Patient;
  redFlagLabels: string[];
}

export function PriorityCard({ patient, redFlagLabels }: PriorityCardProps) {
  const navigate = useNavigate();

  return (
    <div className="card border-l-4 border-l-danger p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-light text-danger">
            <AlertOctagon size={18} />
          </div>
          <div>
            <p className="font-display font-semibold text-ink">
              {patient.name} <span className="font-mono text-sm font-normal text-ink-soft">— {patient.token}</span>
            </p>
            <p className="mt-1 text-sm text-ink-soft">Possible red flags:</p>
            <ul className="mt-1 space-y-0.5">
              {redFlagLabels.map((label) => (
                <li key={label} className="text-sm text-ink">
                  🔴 {label}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-danger">
              Priority Clinical Review
            </p>
          </div>
        </div>
        <Button variant="danger" onClick={() => navigate(`/patients/${patient.id}`)} className="shrink-0">
          Review Now
        </Button>
      </div>
    </div>
  );
}
