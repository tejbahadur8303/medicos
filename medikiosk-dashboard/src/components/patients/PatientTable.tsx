import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient';
import { PriorityBadge, StatusBadge } from './StatusBadge';
import { priorityRailClassName } from '../../utils/status';
import { Button } from '../common/Button';
import { minutesToLabel } from '../../utils/formatDate';

export function PatientTable({ patients }: { patients: Patient[] }) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl2 border border-border bg-surface">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-canvas/60 text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
            <th className="px-5 py-3">Token</th>
            <th className="px-5 py-3">Patient</th>
            <th className="px-5 py-3">Age</th>
            <th className="px-5 py-3">Complaint</th>
            <th className="px-5 py-3">Priority</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Waiting</th>
            <th className="px-5 py-3" />
          </tr>
        </thead>
        <tbody>
          {patients.map((p) => (
            <tr
              key={p.id}
              className={`border-b border-border border-l-4 last:border-b-0 hover:bg-canvas/50 ${priorityRailClassName[p.priority]}`}
            >
              <td className="px-5 py-3 font-mono text-ink-soft">{p.token}</td>
              <td className="px-5 py-3">
                <p className="font-medium text-ink">{p.name}</p>
                <p className="text-xs text-ink-faint">{p.id}</p>
              </td>
              <td className="px-5 py-3 text-ink-soft">{p.age}</td>
              <td className="px-5 py-3 text-ink">{p.chiefComplaint}</td>
              <td className="px-5 py-3">
                <PriorityBadge priority={p.priority} />
              </td>
              <td className="px-5 py-3">
                <StatusBadge status={p.status} />
              </td>
              <td className="px-5 py-3 text-ink-soft">{minutesToLabel(p.waitingSinceMinutes)}</td>
              <td className="px-5 py-3 text-right">
                <Button variant="secondary" onClick={() => navigate(`/patients/${p.id}`)}>
                  View
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
