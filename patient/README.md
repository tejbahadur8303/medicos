# MediKiosk — Patient Kiosk (React + Vite)

The patient-facing side of MediKiosk, built as a React + Vite + TypeScript + Tailwind web app — a hospital self-service kiosk a patient completes before meeting the doctor, in Hindi or English, by voice or by tapping.

This replaces the original Flutter spec's tech stack with React/Vite while keeping the same product flow, screens, and safety rules.

## Run it

```
npm install
npm run dev
```

Open the printed local URL. For the voice features (mic input, "hear question" playback) to work, open it in Chrome or Edge — the app uses the standard `SpeechRecognition` / `speechSynthesis` Web APIs, with everything else (buttons, forms, document upload) working regardless of browser support.

## Demo Mode

The **Try Demo** link on the Welcome screen instantly loads the hackathon demo patient (Rahul Kumar, chest pain, breathlessness, diabetes + hypertension, a flagged blood report) and jumps straight to the AI Summary so judges can see the full story without re-typing anything. Demo Mode (in `useAppStore`) also means `/confirm` won't fail if there's no backend running — the session is queued locally instead of blocking on a network call.

## Patient journey

Welcome → Language → Registration → Consent → Chief Complaint (voice/touch) → Adaptive AI History (chest pain / fever / cough / general flows) → Medication → Allergy → Family & Personal History → Review of Systems → Document Upload → OCR Processing → Medical Timeline → AI Summary → Patient Confirmation → Submission.

Answers are saved to `localStorage` as you go (`zustand/persist`), so a dropped connection or accidental refresh doesn't lose progress — this matches the offline/poor-connectivity requirement from the original brief. Session data is cleared from the device automatically after a successful submission.

## Safety rules baked into the UI

- The AI only **collects → structures → flags**, never diagnoses. Red flags always read "may require urgent medical attention" / "flagged for physician attention," never a named diagnosis.
- The Patient Confirmation screen makes clear that AI-generated information may contain mistakes and must be corrected before submission — the doctor remains the final authority.

## Structure

- `src/screens` — one folder per journey stage (welcome, language, registration, consent, complaint, history, documents, timeline, summary, submission)
- `src/services` — `speechService` (Web Speech API abstraction), `historyService` (adaptive question engine), `redFlagService`, `ocrService` (mock, swap for a real backend call), `apiService` (all backend endpoints, no API keys in the frontend)
- `src/store` — zustand stores for patient/consent, history answers, documents, and app-level state (demo mode, online status, submission)
- `src/widgets` — shared kiosk UI: VoiceButton, LargeOptionButton, QuestionCard, EmergencyAlert, DocumentCard, SummarySection, KioskShell
- `src/utils/constants.ts` — bilingual copy for complaints, review-of-systems items, document categories, family history options

## Connecting the real backend

Set `VITE_API_BASE_URL` in `.env` (defaults to `http://localhost:8080/api`). `apiService.ts` already implements every endpoint from the brief (`/patient/session`, `/history/analyze`, `/document/ocr`, `/summary/generate`, `/session/submit`, `/redflag/alert`, etc.) — none of them are called with hardcoded credentials; any OpenAI/OCR API key belongs server-side in the Node.js backend, never in this app.

## Where OCR is mocked

`src/services/ocrService.ts` returns realistic mock results per document category with a simulated delay so the "Reading… Extracting… Organizing…" screen has something to show. Replace its body with a `fetch`/`api.runOcr()` call once the backend OCR pipeline is live — the return shape already matches the `OCRResult` type the rest of the app expects.
