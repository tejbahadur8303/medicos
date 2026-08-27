# MediKiosk Backend

Node.js / Express / MongoDB API connecting the **Flutter patient kiosk app** and the **React doctor dashboard**. This is the missing middle layer: when a patient registers a complaint on the kiosk, it lands here, and the doctor dashboard sees it live and can approve (verify) it.

```
Flutter Patient Kiosk App  --->  THIS BACKEND (Express + MongoDB + Socket.IO)  --->  React Doctor Dashboard
       (no login)                                                                    (doctor login required)
```

---

## What "the doctor can see and approve" means here

1. Patient completes registration + consent + chief complaint + adaptive history on the Flutter kiosk.
2. Flutter calls `POST /api/patient/session`, then `POST /api/history/answer` per question, then `POST /api/summary/generate`, then `POST /api/session/submit`.
3. The instant the session is created, and again whenever a red flag or the summary appears, this backend emits a **Socket.IO event** (`patient:new`, `patient:priority`, `patient:summary-ready`, `patient:submitted`) to every connected doctor dashboard — so the patient shows up in the queue **without the doctor refreshing**.
4. The doctor opens the patient in the dashboard, reviews the AI-generated summary, edits it if needed (`PUT /api/patients/:id/summary`), and clicks **Confirm History** → `POST /api/patients/:id/verify`. This is the "approve" step: it sets `status = VERIFIED` and records `verifiedBy` + `verifiedAt`.
5. Doctor clicks **Start Consultation** → `POST /api/patients/:id/start-consultation`, then **Complete Consultation** → `POST /api/patients/:id/complete-consultation`.

---

## Setup

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) or a MongoDB Atlas connection string

### Install & configure
```bash
cd medikiosk-backend
npm install
cp .env.example .env    # already present with sane local defaults — edit MONGODB_URI if using Atlas
```

### Seed demo data (recommended for first run)
```bash
npm run seed
```
This creates:
- A demo doctor login: **sharma@demohospital.in / demo123**
- A demo patient: **Rahul Kumar**, token `A-102`, chest pain, priority flag (breathlessness), diabetes/hypertension history, Metformin — matching the dashboard's flagship demo case.

### Run
```bash
npm run dev      # nodemon, auto-restart on changes
# or
npm start
```
Server starts on `http://localhost:8080` (see `.env` → `PORT`). Health check: `GET /health`.

**Note on MongoDB being down:** the server intentionally still boots and listens even if MongoDB is unreachable at startup (useful during development) — but any request touching the database will fail with a clear error until MongoDB is reachable. Start `mongod` before testing real endpoints.

---

## Connecting the frontends

**React dashboard** — set in its `.env`:
```
VITE_API_BASE_URL=http://localhost:8080/api
```
Doctor dashboard routes require a Bearer token from `POST /api/auth/login`. Log in with the seeded demo doctor, or call `POST /api/auth/seed-demo-doctor` to create it via HTTP instead of the seed script.

**Flutter kiosk app** — set in `lib/utils/constants.dart`:
```dart
const String kBackendBaseUrl = 'http://10.0.2.2:8080'; // Android emulator
// or your machine's LAN IP for a real device
```
Kiosk intake routes (`/api/patient/session`, `/api/history/answer`, etc.) intentionally require **no doctor login** — there's no doctor at the kiosk terminal.

---

## Live updates (Socket.IO)

The React dashboard can connect to receive real-time events instead of polling:

```ts
import { io } from 'socket.io-client';
const socket = io(import.meta.env.VITE_API_BASE_URL.replace('/api', ''));

socket.on('patient:new', (payload) => { /* refetch queue */ });
socket.on('patient:priority', (payload) => { /* show priority toast */ });
socket.on('patient:summary-ready', (payload) => { /* refetch patient */ });
socket.on('patient:submitted', (payload) => { /* refetch queue */ });
socket.on('patient:updated', (payload) => { /* refetch patient detail */ });
```
(The dashboard project provided separately currently polls via its hooks — wiring this socket client in is a drop-in enhancement, not required for the core "register → doctor approves" flow to work.)

---

## API Reference

### Kiosk intake (no auth — called by Flutter)
```
POST /api/patient/session          Create patient session after registration+consent
POST /api/history/answer           Submit one adaptive-history answer (re-evaluates red flags)
POST /api/summary/generate         Compose the structured AI summary from all collected data
POST /api/document/upload          Register an uploaded document (metadata)
POST /api/document/ocr             Run OCR extraction on an uploaded document
POST /api/session/submit           Final submission — patient enters the doctor's queue
POST /api/redflag/alert            Explicit "Alert Hospital Staff" trigger
GET  /api/session/:id              Resume/check a kiosk session
```

### Doctor auth
```
POST /api/auth/login               { email, password } -> { token, doctor }
GET  /api/auth/me                  Current doctor profile (requires Bearer token)
POST /api/auth/seed-demo-doctor    Creates Dr. Sharma / demo123 if not already present
```

### Doctor dashboard (all require `Authorization: Bearer <token>`)
```
GET  /api/patients                 All patients
GET  /api/patients/queue           Active queue (not completed)
GET  /api/patients/priority        Priority-flagged patients
GET  /api/patients/:id             Single patient
GET  /api/patients/:id/history     Raw structured clinical history
GET  /api/patients/:id/summary     AI-generated draft summary
PUT  /api/patients/:id/summary     Doctor edits the summary (records who/when)
POST /api/patients/:id/verify      Doctor approves/confirms the history  <-- the "approve" action
POST /api/patients/:id/mark-priority
POST /api/patients/:id/start-consultation
POST /api/patients/:id/complete-consultation
GET  /api/patients/:id/documents
GET  /api/patients/:id/timeline
GET  /api/notifications
POST /api/notifications/:id/read
POST /api/doctor/notes             Doctor consultation notes (never AI-filled)
```

---

## Project Structure

```
src/
  server.js                Express app + Socket.IO bootstrap
  config/db.js              MongoDB connection
  models/                   Patient, Doctor, MedicalDocument, TimelineEvent, Notification
  routes/                   auth.js, patients.js, intake.js, misc.js
  controllers/               authController, patientController, intakeController,
                              documentController, notificationController
  middleware/                auth.js (JWT guard), errorHandler.js
  services/                  authService (JWT sign/verify), redFlagService (non-diagnostic
                              triage logic), ocrService (mock — swap for a real provider)
  sockets/                   Socket.IO room + emit helper for live dashboard updates
  utils/seed.js              Demo doctor + demo patient seeder
```

---

## Safety & Security Notes

- **No diagnosis logic anywhere.** `redFlagService.js` only ever returns neutral pattern descriptions ("Chest pain with breathing difficulty reported") — never a diagnosis. This mirrors the equivalent client-side logic in the Flutter app; the backend re-evaluates authoritatively so the dashboard's triage signal can't be spoofed by a tampered or offline client.
- **API keys never touch the frontends.** Any real OCR/LLM provider key goes in this backend's `.env` only (see `services/ocrService.js` — currently a mock; that's the file to edit when wiring a real provider).
- **JWT-based doctor auth.** Passwords are bcrypt-hashed (`Doctor.hashPassword`); tokens are short-lived (`JWT_EXPIRES_IN`, default 12h). Kiosk intake routes are deliberately unauthenticated since a hospital kiosk has no doctor logged in — lock those down with a per-kiosk API key or IP allowlist at the infrastructure level before real deployment.
- **CORS is restricted** to `CORS_ORIGIN` in `.env` — update it to your deployed dashboard's origin in production.
