import type { PatientStatus, PatientPriority } from '../types/patient';

export interface StatusVisual {
  label: string;
  className: string; // background + text tailwind classes
  dotClassName: string;
}

export const statusVisuals: Record<PatientStatus, StatusVisual> = {
  NEW: { label: 'New', className: 'bg-accent-light text-accent', dotClassName: 'bg-accent' },
  WAITING: { label: 'Waiting', className: 'bg-ink-faint/10 text-ink-soft', dotClassName: 'bg-ink-faint' },
  PRIORITY: { label: 'Priority', className: 'bg-danger-light text-danger', dotClassName: 'bg-danger' },
  IN_REVIEW: { label: 'In Review', className: 'bg-warning-light text-warning', dotClassName: 'bg-warning' },
  IN_CONSULTATION: { label: 'In Consultation', className: 'bg-accent-light text-accent', dotClassName: 'bg-accent' },
  VERIFIED: { label: 'History Verified', className: 'bg-success-light text-success', dotClassName: 'bg-success' },
  COMPLETED: { label: 'Completed', className: 'bg-ink-faint/10 text-ink-soft', dotClassName: 'bg-ink-faint' },
  NEEDS_REVIEW: { label: 'Needs Review', className: 'bg-warning-light text-warning', dotClassName: 'bg-warning' },
  FAILED: { label: 'Failed', className: 'bg-danger-light text-danger', dotClassName: 'bg-danger' },
};

export const priorityVisuals: Record<PatientPriority, StatusVisual> = {
  normal: { label: 'Normal', className: 'bg-success-light text-success', dotClassName: 'bg-success' },
  review: { label: 'Review', className: 'bg-warning-light text-warning', dotClassName: 'bg-warning' },
  priority: { label: 'Priority', className: 'bg-danger-light text-danger', dotClassName: 'bg-danger' },
};

/** Maps priority to the "clinical rail" accent color used as a left border
 * on queue rows and the patient header — the dashboard's signature motif
 * for at-a-glance triage without reading text. */
export const priorityRailClassName: Record<PatientPriority, string> = {
  normal: 'border-l-success',
  review: 'border-l-warning',
  priority: 'border-l-danger',
};
