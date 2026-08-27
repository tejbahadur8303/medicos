import { FileText, FlaskConical, Stethoscope, ScanLine, AlertTriangle } from 'lucide-react';
import type { MedicalDocument } from '../../types/document';
import { formatDate } from '../../utils/formatDate';
import { Button } from '../common/Button';

const typeIcon = {
  Prescription: FileText,
  'Lab Report': FlaskConical,
  'Discharge Summary': Stethoscope,
  'Imaging Report': ScanLine,
};

export function DocumentCard({ document, onView }: { document: MedicalDocument; onView: () => void }) {
  const Icon = typeIcon[document.type];
  const flaggedFields = document.extractedData.fields.filter((f) => f.flagged);

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          <Icon size={19} />
        </div>
        <div className="flex-1">
          <p className="font-display font-semibold text-ink">{document.title}</p>
          <p className="text-xs text-ink-faint">{formatDate(document.date)}</p>

          <div className="mt-3 space-y-1">
            {document.extractedData.fields.slice(0, 3).map((f) => (
              <p key={f.label} className="text-sm text-ink">
                {f.label}: <span className="font-medium">{f.value}{f.unit ? ` ${f.unit}` : ''}</span>
                {f.flagged && (
                  <span className="ml-1.5 text-xs font-medium text-warning">⚠ Flagged</span>
                )}
              </p>
            ))}
          </div>

          {flaggedFields.length > 0 && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-medium text-warning">
              <AlertTriangle size={13} />
              {flaggedFields.length} value{flaggedFields.length > 1 ? 's' : ''} flagged for physician attention
            </div>
          )}

          <Button variant="secondary" onClick={onView} className="mt-4">
            View Document
          </Button>
        </div>
      </div>
    </div>
  );
}
