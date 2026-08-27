import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Gauge } from 'lucide-react';
import { usePatient } from '../hooks/usePatient';
import { useAppStore } from '../hooks/useAppStore';
import { patientService } from '../services/patientService';
import { historyService } from '../services/historyService';
import { consultationService } from '../services/consultationService';

import { PatientHeader } from '../components/patients/PatientHeader';
import { PriorityAlert } from '../components/patients/PriorityAlert';
import { ClinicalSummary } from '../components/history/ClinicalSummary';
import { DocumentCard } from '../components/documents/DocumentCard';
import { DocumentViewer } from '../components/documents/DocumentViewer';
import { MedicalTimeline } from '../components/timeline/MedicalTimeline';
import { DoctorNotes } from '../components/consultation/DoctorNotes';
import { ConsultationActions } from '../components/consultation/ConsultationActions';
import { Loading } from '../components/common/Loading';
import { ErrorState } from '../components/common/ErrorState';
import { EmptyState } from '../components/common/EmptyState';
import { Modal } from '../components/common/Modal';
import { Button } from '../components/common/Button';
import type { MedicalDocument } from '../types/document';
import type { RedFlag } from '../types/history';

type Tab = 'overview' | 'history' | 'documents' | 'timeline' | 'summary' | 'notes';

const tabs: { key: Tab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'Clinical History' },
  { key: 'documents', label: 'Documents' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'summary', label: 'AI Summary' },
  { key: 'notes', label: 'Notes' },
];

export function PatientDetails() {
  const { patientId } = useParams<{ patientId: string }>();
  const { doctor } = useAppStore();
  const { patient, summary, documents, timeline, loading, error, refetch, setSummary } = usePatient(patientId);

  const [tab, setTab] = useState<Tab>('overview');
  const [viewingDoc, setViewingDoc] = useState<MedicalDocument | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  if (loading) return <Loading label="Loading patient…" />;
  if (error) return <ErrorState onRetry={refetch} />;
  if (!patient) return <EmptyState title="Patient not found" message="This patient may have been removed from the queue." />;

  const redFlags: RedFlag[] = (summary?.content.reviewOfSystems
    ? Object.entries(summary.content.reviewOfSystems).flatMap(([, symptoms]) =>
        Object.entries(symptoms)
          .filter(([, present]) => present)
          .map(([symptom]) => symptom),
      )
    : []
  )
    .filter((s) => ['Chest pain', 'Breathlessness'].includes(s))
    .map((label) => ({ label, source: 'Patient-reported history' as const }));

  async function handleStartConsultation() {
    if (!patient) return;
    await patientService.startConsultation(patient.id, doctor.name);
    refetch();
  }

  async function handleMarkPriority() {
    if (!patient) return;
    await patientService.markPriority(patient.id);
    refetch();
  }

  async function handleCompleteConsultation() {
    if (!patient) return;
    await patientService.completeConsultation(patient.id);
    refetch();
  }

  async function handleSaveSummary(updated: typeof summary) {
    if (!patient || !updated) return;
    setSummary(updated);
    await historyService.updateSummary(patient.id, updated);
  }

  async function handleConfirmSummary() {
    setConfirmDialogOpen(true);
  }

  async function doConfirm() {
    if (!patient || !summary) return;
    const verifiedSummary = {
      ...summary,
      verified: true,
      verifiedBy: doctor.name,
      verifiedAt: new Date().toISOString(),
    };
    setSummary(verifiedSummary);
    await historyService.verify(patient.id, doctor.name);
    setConfirmDialogOpen(false);
  }

  async function handleSaveNoteDraft(content: string) {
    if (!patient) return;
    await consultationService.saveNote(patient.id, content, 'draft');
  }

  return (
    <div className="space-y-6">
      <PatientHeader
        patient={patient}
        onStartConsultation={handleStartConsultation}
        onMarkPriority={handleMarkPriority}
        onPrint={() => window.print()}
      />

      {redFlags.length > 0 && <PriorityAlert flags={redFlags} onReview={() => setTab('summary')} />}

      <div className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.key ? 'border-primary text-primary' : 'border-transparent text-ink-soft hover:text-ink'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card p-5">
            <p className="label-eyebrow mb-1.5">Chief Complaint</p>
            <p className="text-lg font-medium text-ink">{patient.chiefComplaint}</p>
          </div>
          <div className="card p-5">
            <p className="label-eyebrow mb-1.5">Current Status</p>
            <p className="text-lg font-medium text-ink">🟡 Awaiting consultation</p>
          </div>
          {summary && (
            <div className="card p-5 md:col-span-2">
              <div className="flex items-center gap-2">
                <Gauge size={16} className="text-accent" />
                <p className="label-eyebrow">History Extraction Confidence</p>
              </div>
              <p className="mt-1.5 text-lg font-medium text-ink">{summary.confidence}%</p>
              <p className="mt-1 text-xs text-ink-faint">
                Reflects how confidently the intake was structured from the patient's voice and touch responses — not diagnostic certainty.
              </p>
            </div>
          )}
        </div>
      )}

      {tab === 'history' && summary && (
        <ClinicalSummary summary={summary} onSave={handleSaveSummary} onConfirm={handleConfirmSummary} />
      )}

      {tab === 'documents' && (
        <div>
          {documents.length === 0 ? (
            <EmptyState title="No documents uploaded" message="This patient did not scan any previous medical documents." />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {documents.map((d) => (
                <DocumentCard key={d.id} document={d} onView={() => setViewingDoc(d)} />
              ))}
            </div>
          )}
          <DocumentViewer document={viewingDoc} onClose={() => setViewingDoc(null)} />
        </div>
      )}

      {tab === 'timeline' && <MedicalTimeline events={timeline} />}

      {tab === 'summary' && summary && (
        <ClinicalSummary summary={summary} onSave={handleSaveSummary} onConfirm={handleConfirmSummary} />
      )}

      {tab === 'notes' && (
        <div className="space-y-4">
          <DoctorNotes patientId={patient.id} onSaveDraft={handleSaveNoteDraft} />
          <ConsultationActions patient={patient} onComplete={handleCompleteConsultation} />
        </div>
      )}

      <Modal
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        title="Confirm History"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={doConfirm}>
              Confirm
            </Button>
          </>
        }
      >
        <p className="text-sm text-ink-soft">Have you reviewed the AI-generated history?</p>
      </Modal>
    </div>
  );
}
