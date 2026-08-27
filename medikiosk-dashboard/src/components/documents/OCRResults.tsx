import { CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';
import type { OCRResult } from '../../types/document';

export function OCRResults({ data }: { data: OCRResult }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="label-eyebrow mb-2">Extracted Fields</h4>
        <div className="space-y-2">
          {data.fields.map((f) => (
            <div
              key={f.label}
              className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5"
            >
              <div>
                <p className="text-xs text-ink-soft">{f.label}</p>
                <p className="font-medium text-ink">
                  {f.value}
                  {f.unit ? ` ${f.unit}` : ''}
                </p>
              </div>
              <div className="text-right">
                {f.confidence === 'high' ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
                    <CheckCircle2 size={13} /> High confidence
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-warning">
                    <AlertCircle size={13} /> Needs verification
                  </span>
                )}
                {f.flagged && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-warning">
                    <AlertTriangle size={13} /> Flagged for physician attention
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {data.diagnosesNoted && data.diagnosesNoted.length > 0 && (
        <div>
          <h4 className="label-eyebrow mb-2">Diagnoses Noted in Document</h4>
          <ul className="space-y-1 text-sm text-ink">
            {data.diagnosesNoted.map((d) => (
              <li key={d}>• {d}</li>
            ))}
          </ul>
        </div>
      )}

      {data.medicationsNoted && data.medicationsNoted.length > 0 && (
        <div>
          <h4 className="label-eyebrow mb-2">Medications Noted in Document</h4>
          <ul className="space-y-1 text-sm text-ink">
            {data.medicationsNoted.map((m) => (
              <li key={m}>• {m}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
