import { Printer, AlertOctagon, Play } from 'lucide-react';
import type { Patient } from '../../types/patient';
import { StatusBadge } from './StatusBadge';
import { Button } from '../common/Button';
import { priorityRailClassName } from '../../utils/status';

interface PatientHeaderProps {
  patient: Patient;
  onStartConsultation: () => void;
  onMarkPriority: () => void;
  onPrint: () => void;
}

export function PatientHeader({ patient, onStartConsultation, onMarkPriority, onPrint }: PatientHeaderProps) {
  const canStart = patient.status === 'WAITING' || patient.status === 'PRIORITY' || patient.status === 'VERIFIED';

  return (
    <div className={`card border-l-4 p-6 ${priorityRailClassName[patient.priority]}`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl font-semibold text-ink">{patient.name}</h1>
            <StatusBadge status={patient.status} />
          </div>
          <p className="mt-1 text-sm text-ink-soft">
            {patient.age} years • {patient.gender}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            <span className="text-ink-soft">
              Patient ID <span className="font-mono font-medium text-ink">{patient.id}</span>
            </span>
            <span className="text-ink-soft">
              Token <span className="font-mono font-medium text-ink">{patient.token}</span>
            </span>
            <span className="text-ink-soft">
              Language <span className="font-medium text-ink">{patient.language}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="primary" icon={<Play size={16} />} onClick={onStartConsultation} disabled={!canStart}>
            Start Consultation
          </Button>
          <Button variant="secondary" icon={<AlertOctagon size={16} />} onClick={onMarkPriority}>
            Mark Priority
          </Button>
          <Button variant="secondary" icon={<Printer size={16} />} onClick={onPrint}>
            Print Summary
          </Button>
        </div>
      </div>
    </div>
  );
}
