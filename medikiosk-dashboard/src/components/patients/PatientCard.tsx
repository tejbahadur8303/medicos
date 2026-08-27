import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient';
import { StatusBadge, PriorityBadge } from './StatusBadge';
import { priorityRailClassName } from '../../utils/status';
import { Button } from '../common/Button';
import { minutesToLabel } from '../../utils/formatDate';

export function PatientCard({ patient }: { patient: Patient }) {
  const navigate = useNavigate();

  return (
    <div className={`card border-l-4 p-5 ${priorityRailClassName[patient.priority]}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-display font-semibold text-ink">{patient.name}</p>
          <p className="text-xs text-ink-faint">
            {patient.id} • {patient.token}
          </p>
          <p className="mt-2 text-sm text-ink">{patient.chiefComplaint}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <PriorityBadge priority={patient.priority} />
            <StatusBadge status={patient.status} />
          </div>
          <p className="mt-2 text-xs text-ink-soft">Waiting {minutesToLabel(patient.waitingSinceMinutes)}</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/patients/${patient.id}`)}>
          View
        </Button>
      </div>
    </div>
  );
}
