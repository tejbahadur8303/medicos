# MediKiosk — Doctor Dashboard

**Complete Patient History. Before the Consultation.**

A React + Vite + TypeScript web dashboard for hospital doctors. This is the **doctor-facing counterpart** to the MediKiosk Flutter patient kiosk app — a completely separate project, communicating only through a shared Node.js backend API (not built here). This repo contains **no Flutter code** — it is 100% React/Vite/TypeScript.

---

## Architecture

```
Flutter Patient Kiosk App  ->  Node.js / Express Backend  ->  React Doctor Dashboard (this project)
                                    |
                              AI Processing + OCR
```

The dashboard never generates diagnoses. It follows: **Collect -> Structure -> Summarize -> Flag** (AI) and **Review -> Edit -> Verify -> Diagnose -> Treat** (doctor).

---

## Tech Stack

- React 19 + Vite + TypeScript
- Tailwind CSS (custom healthcare design system — teal/blue palette matching the patient kiosk app)
- React Router for navigation
- Zustand for state (doctor profile, notifications, demo mode)
- Axios for API calls
- Lucide React for icons
- Recharts available for any future chart needs (dashboard intentionally avoids overcrowding with charts per the brief)

---

## Getting Started

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

To build for production:
```bash
npm run build
npm run preview
```

---

## Demo Mode

**Demo Mode is ON by default** — the dashboard works immediately with no backend running, using realistic mock data (`src/data/mockPatients.ts`, `src/data/mockDocuments.ts`).

Toggle it from **Settings -> Data Source -> Demo Data**. When OFF, the dashboard calls the real backend at `VITE_API_BASE_URL`; if that call fails for any reason, every service method automatically falls back to mock data anyway, so the dashboard never shows a blank screen during a live demo.

The flagship demo patient is **Rahul Kumar** (`MK-1024`, token `A-102`): chest pain, priority flag (chest pain + breathlessness), diabetes/hypertension history, a flagged glucose lab value (178 mg/dL), and a full editable AI-generated clinical summary — walk through Dashboard -> Priority Patients -> open Rahul Kumar -> Clinical History tab -> Documents tab (view the blood report) -> Timeline tab -> edit a medication -> Confirm History -> Start Consultation -> add notes -> Complete Consultation.

---

## Environment Variables

```
VITE_API_BASE_URL=http://localhost:8080/api
```

Set in `.env`. Never hardcode a production URL, and never put API keys or database credentials in this project — those belong on the Node.js backend only.

---

## Backend API Endpoints Expected

```
GET  /api/patients
GET  /api/patients/:id
GET  /api/patients/queue
GET  /api/patients/priority
GET  /api/patients/:id/history
GET  /api/patients/:id/documents
GET  /api/patients/:id/timeline
GET  /api/patients/:id/summary
PUT  /api/patients/:id/summary
POST /api/patients/:id/verify
POST /api/patients/:id/start-consultation
POST /api/patients/:id/complete-consultation
GET  /api/notifications
POST /api/doctor/notes
```

All calls are centralized in `src/services/*.ts` — one file per resource, each with automatic mock-data fallback.

---

## Project Structure

```
src/
  components/
    layout/        Sidebar, Topbar
    dashboard/      StatCard, PriorityCard, PatientQueue, RecentActivity, NotificationPanel
    patients/       PatientCard, PatientTable, PatientHeader, StatusBadge, PriorityAlert
    history/        ClinicalSummary, HistorySection, EditSummaryModal, VerificationBadge
    documents/      DocumentCard, DocumentViewer, OCRResults
    timeline/       MedicalTimeline, TimelineItem
    consultation/   DoctorNotes, ConsultationActions
    common/         Button, Modal, Loading, EmptyState, ErrorState
  pages/            Dashboard, PatientQueue, PatientDetails, PriorityPatients,
                     Patients, Documents, History, Settings
  services/         api.ts, patientService.ts, documentService.ts,
                     historyService.ts, consultationService.ts
  hooks/            usePatients, usePatient, useQueue, useAppStore, useDemoStore
  types/            patient, history, document, timeline, consultation
  data/             mockPatients.ts, mockDocuments.ts
  utils/            formatDate.ts, status.ts
```

---

## Medical Safety Design (Important)

This dashboard is **not an AI doctor**:
- Never displays a diagnosis (e.g. never "Patient has a heart attack")
- Red flags are shown only as neutral triage prompts: *"Potential red flag detected — priority clinical review recommended"*
- Every AI-generated summary is labeled **AI-Generated Draft** with a visible confidence score explicitly called **"History extraction confidence"** — never framed as diagnostic certainty
- The summary is always editable, and must be explicitly confirmed by the doctor (with doctor name + timestamp recorded) before it's treated as verified
- Doctor notes are never auto-filled by AI — the doctor has full control
- Abnormal lab values are labeled **"Flagged for physician attention"**, never interpreted
- Low-confidence OCR fields are labeled **"Needs verification"**, never silently assumed correct

---

## Accessibility & Design

- Desktop-first (primary use case: hospital computer), responsive down to tablet
- High-contrast healthcare blue/teal palette, semantic color use only (danger=red, warning=amber, success=green)
- Every interactive element is keyboard-reachable with visible focus states
- Every data-fetching view has loading, error, and empty states — the dashboard never shows a blank screen
