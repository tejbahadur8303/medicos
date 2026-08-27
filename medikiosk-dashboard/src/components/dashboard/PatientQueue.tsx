import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient';
import { PatientTable } from '../patients/PatientTable';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';

export function PatientQueue({ patients }: { patients: Patient[] }) {
  const navigate = useNavigate();
  const preview = patients.slice(0, 5);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">Patient Queue</h2>
        <Button variant="ghost" onClick={() => navigate('/queue')}>
          View all →
        </Button>
      </div>
      {preview.length === 0 ? (
        <EmptyState title="No patients in queue" message="New patients from the kiosk app will appear here." />
      ) : (
        <PatientTable patients={preview} />
      )}
    </div>
  );
}
