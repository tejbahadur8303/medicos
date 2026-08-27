import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import type { AISummary } from '../../types/history';
import { HistorySection, BulletList } from './HistorySection';
import { VerificationBadge } from './VerificationBadge';
import { Button } from '../common/Button';
import { EditSummaryModal } from './EditSummaryModal';

interface ClinicalSummaryProps {
  summary: AISummary;
  onSave: (updated: AISummary) => void;
  onConfirm: () => void;
}

export function ClinicalSummary({ summary, onSave, onConfirm }: ClinicalSummaryProps) {
  const [editing, setEditing] = useState(false);
  const { content } = summary;

  return (
    <div className="card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-semibold text-ink">Physician-Ready Clinical Summary</h2>
        <VerificationBadge
          verified={summary.verified}
          verifiedBy={summary.verifiedBy}
          verifiedAt={summary.verifiedAt}
          confidence={summary.confidence}
        />
      </div>

      <HistorySection title="Chief Complaint">
        <p className="font-medium">{content.chiefComplaint}</p>
      </HistorySection>

      <HistorySection title="History of Present Illness">
        <BulletList items={content.historyOfPresentIllness} />
      </HistorySection>

      <HistorySection title="Past Medical History">
        <BulletList items={content.pastMedicalHistory} />
      </HistorySection>

      <HistorySection title="Past Surgical History">
        <BulletList items={content.pastSurgicalHistory} emptyLabel="No previous surgery reported." />
      </HistorySection>

      <HistorySection title="Medication History">
        <ul className="space-y-1">
          {content.medications.length === 0 && <p className="text-ink-soft">None reported</p>}
          {content.medications.map((m) => (
            <li key={m.name} className="flex items-center gap-2">
              <span className="mt-0 h-1 w-1 shrink-0 rounded-full bg-ink-faint" />
              <span>
                {m.name}
                {m.dosage ? ` — ${m.dosage}` : ''}
                {m.frequency ? ` (${m.frequency})` : ''}
              </span>
              {m.needsVerification && (
                <span className="rounded-full bg-warning-light px-2 py-0.5 text-xs font-medium text-warning">
                  Needs verification
                </span>
              )}
            </li>
          ))}
        </ul>
      </HistorySection>

      <HistorySection title="Allergy History">
        <BulletList items={content.allergies} emptyLabel="No known allergy reported." />
      </HistorySection>

      <HistorySection title="Family History">
        <BulletList items={content.familyHistory} />
      </HistorySection>

      <HistorySection title="Personal History">
        <ul className="space-y-1">
          {Object.entries(content.personalHistory)
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <li key={k} className="capitalize">
                {k.replace(/([A-Z])/g, ' $1')}: <span className="text-ink-soft">{v}</span>
              </li>
            ))}
        </ul>
      </HistorySection>

      <HistorySection title="Review of Systems">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(content.reviewOfSystems).map(([system, symptoms]) => (
            <div key={system}>
              <p className="text-xs font-semibold text-ink-soft">{system}</p>
              <ul className="mt-1 space-y-0.5">
                {Object.entries(symptoms).map(([symptom, present]) => (
                  <li key={symptom} className="text-sm">
                    {symptom} — {present ? <span className="text-danger">Yes</span> : <span className="text-ink-soft">No significant symptom reported</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </HistorySection>

      <div className="mt-4 flex gap-3">
        <Button variant="secondary" icon={<Pencil size={16} />} onClick={() => setEditing(true)}>
          Edit
        </Button>
        <Button
          variant="primary"
          icon={<Check size={16} />}
          onClick={onConfirm}
          disabled={summary.verified}
        >
          {summary.verified ? 'Confirmed' : 'Confirm'}
        </Button>
      </div>

      <EditSummaryModal
        open={editing}
        summary={summary}
        onClose={() => setEditing(false)}
        onSave={(updated) => {
          onSave(updated);
          setEditing(false);
        }}
      />
    </div>
  );
}
