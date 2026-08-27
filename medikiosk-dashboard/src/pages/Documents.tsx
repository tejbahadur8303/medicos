import { useState, useEffect } from 'react';
import type { MedicalDocument } from '../types/document';
import type { Patient } from '../types/patient';
import { usePatients } from '../hooks/usePatients';
import { documentService } from '../services/documentService';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentViewer } from '../components/documents/DocumentViewer';
import { Loading } from '../components/common/Loading';
import { EmptyState } from '../components/common/EmptyState';

interface DocEntry {
  document: MedicalDocument;
  patient: Patient;
}

export function Documents() {
  const { patients, loading: patientsLoading } = usePatients();
  const [entries, setEntries] = useState<DocEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<MedicalDocument | null>(null);

  useEffect(() => {
    if (patientsLoading) return;
    setLoading(true);
    Promise.all(
      patients.map(async (p) => {
        const docs = await documentService.getByPatientId(p.id);
        return docs.map((d) => ({ document: d, patient: p }));
      }),
    )
      .then((lists) => setEntries(lists.flat()))
      .finally(() => setLoading(false));
  }, [patients, patientsLoading]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Medical Documents</h1>
        <p className="mt-1 text-sm text-ink-soft">Documents scanned by patients via the kiosk app, OCR-processed and ready for review.</p>
      </div>

      {loading || patientsLoading ? (
        <Loading label="Loading documents…" />
      ) : entries.length === 0 ? (
        <EmptyState title="No documents uploaded yet" message="Documents scanned by patients on the kiosk will appear here once processed." />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {entries.map(({ document, patient }) => (
            <div key={document.id}>
              <p className="mb-1.5 text-xs font-medium text-ink-soft">{patient.name} · {patient.token}</p>
              <DocumentCard document={document} onView={() => setViewing(document)} />
            </div>
          ))}
        </div>
      )}

      <DocumentViewer document={viewing} onClose={() => setViewing(null)} />
    </div>
  );
}
