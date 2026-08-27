import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { Patient } from '../../types/patient';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { formatTime } from '../../utils/formatDate';

interface ConsultationActionsProps {
  patient: Patient;
  onComplete: () => void;
}

export function ConsultationActions({ patient, onComplete }: ConsultationActionsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (patient.status === 'COMPLETED') {
    return (
      <div className="card flex items-center gap-3 border-l-4 border-l-success p-5">
        <CheckCircle2 className="text-success" size={20} />
        <div>
          <p className="font-medium text-ink">Consultation completed</p>
          {patient.consultation?.completedAt && (
            <p className="text-sm text-ink-soft">at {formatTime(patient.consultation.completedAt)}</p>
          )}
        </div>
      </div>
    );
  }

  if (patient.status !== 'IN_CONSULTATION') {
    return null;
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-ink">In Consultation</p>
          {patient.consultation?.startedAt && (
            <p className="text-sm text-ink-soft">
              Started at {formatTime(patient.consultation.startedAt)} by {patient.consultation.doctorName}
            </p>
          )}
        </div>
        <Button variant="primary" onClick={() => setConfirmOpen(true)}>
          Complete Consultation
        </Button>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Complete this consultation?"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                onComplete();
                setConfirmOpen(false);
              }}
            >
              Complete
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">
          This will mark the patient as completed and remove them from the active queue.
        </p>
      </Modal>
    </div>
  );
}
