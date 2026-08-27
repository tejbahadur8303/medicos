import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { AISummary, Medication } from '../../types/history';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAppStore } from '../../hooks/useAppStore';

interface EditSummaryModalProps {
  open: boolean;
  summary: AISummary;
  onClose: () => void;
  onSave: (updated: AISummary) => void;
}

export function EditSummaryModal({ open, summary, onClose, onSave }: EditSummaryModalProps) {
  const { doctor } = useAppStore();
  const [chiefComplaint, setChiefComplaint] = useState(summary.content.chiefComplaint);
  const [hpi, setHpi] = useState<string[]>(summary.content.historyOfPresentIllness);
  const [medications, setMedications] = useState<Medication[]>(summary.content.medications);
  const [allergies, setAllergies] = useState<string[]>(summary.content.allergies);

  useEffect(() => {
    if (open) {
      setChiefComplaint(summary.content.chiefComplaint);
      setHpi(summary.content.historyOfPresentIllness);
      setMedications(summary.content.medications);
      setAllergies(summary.content.allergies);
    }
  }, [open, summary]);

  function updateHpiLine(index: number, value: string) {
    setHpi((prev) => prev.map((line, i) => (i === index ? value : line)));
  }

  function removeHpiLine(index: number) {
    setHpi((prev) => prev.filter((_, i) => i !== index));
  }

  function updateMedication(index: number, patch: Partial<Medication>) {
    setMedications((prev) => prev.map((m, i) => (i === index ? { ...m, ...patch } : m)));
  }

  function removeMedication(index: number) {
    setMedications((prev) => prev.filter((_, i) => i !== index));
  }

  function updateAllergy(index: number, value: string) {
    setAllergies((prev) => prev.map((a, i) => (i === index ? value : a)));
  }

  function removeAllergy(index: number) {
    setAllergies((prev) => prev.filter((_, i) => i !== index));
  }

  function handleSave() {
    const updated: AISummary = {
      ...summary,
      content: {
        ...summary.content,
        chiefComplaint,
        historyOfPresentIllness: hpi.filter((l) => l.trim() !== ''),
        medications,
        allergies: allergies.filter((a) => a.trim() !== ''),
      },
      lastEditedBy: doctor.name,
      lastEditedAt: new Date().toISOString(),
    };
    onSave(updated);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Clinical Summary"
      widthClassName="max-w-2xl"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </>
      }
    >
      <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-1">
        <div>
          <label className="label-eyebrow mb-1.5 block">Chief Complaint</label>
          <input className="input" value={chiefComplaint} onChange={(e) => setChiefComplaint(e.target.value)} />
        </div>

        <div>
          <label className="label-eyebrow mb-1.5 block">History of Present Illness</label>
          <div className="space-y-2">
            {hpi.map((line, i) => (
              <div key={i} className="flex gap-2">
                <input className="input" value={line} onChange={(e) => updateHpiLine(i, e.target.value)} />
                <button
                  onClick={() => removeHpiLine(i)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-canvas hover:text-danger"
                  aria-label="Remove line"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setHpi((prev) => [...prev, ''])}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark"
            >
              <Plus size={15} /> Add line
            </button>
          </div>
        </div>

        <div>
          <label className="label-eyebrow mb-1.5 block">Medications</label>
          <div className="space-y-2">
            {medications.map((m, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="input"
                  placeholder="Name"
                  value={m.name}
                  onChange={(e) => updateMedication(i, { name: e.target.value })}
                />
                <input
                  className="input"
                  placeholder="Dosage"
                  value={m.dosage ?? ''}
                  onChange={(e) => updateMedication(i, { dosage: e.target.value })}
                />
                <button
                  onClick={() => removeMedication(i)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-canvas hover:text-danger"
                  aria-label="Remove medication"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setMedications((prev) => [...prev, { name: '' }])}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark"
            >
              <Plus size={15} /> Add medication
            </button>
          </div>
        </div>

        <div>
          <label className="label-eyebrow mb-1.5 block">Allergies</label>
          <div className="space-y-2">
            {allergies.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input className="input" value={a} onChange={(e) => updateAllergy(i, e.target.value)} />
                <button
                  onClick={() => removeAllergy(i)}
                  className="rounded-lg p-2 text-ink-faint hover:bg-canvas hover:text-danger"
                  aria-label="Remove allergy"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              onClick={() => setAllergies((prev) => [...prev, ''])}
              className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark"
            >
              <Plus size={15} /> Add allergy
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
