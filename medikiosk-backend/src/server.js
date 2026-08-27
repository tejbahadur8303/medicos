import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import http from "http";

import { connectDB } from "./config/db.js";
import { initSockets } from "./sockets/index.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import intakeRoutes from "./routes/intake.js";
import miscRoutes from "./routes/misc.js";

const app = express();
const PORT = process.env.PORT || 8080;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));

app.get("/health", (req, res) =>
  res.json({ ok: true, service: "medikiosk-backend" }),
);

// Doctor auth (login/me)
app.use("/api/auth", authRoutes);

// Doctor-dashboard-facing routes (require auth): GET/PUT /api/patients/...
app.use("/api/patients", patientRoutes);
app.use("/api", intakeRoutes);

// Notifications + doctor notes (require auth)
app.use("/api", miscRoutes);

// Flutter kiosk-facing intake routes (no doctor auth):
// /api/patient/session, /api/history/answer, /api/summary/generate,
// /api/document/upload, /api/document/ocr, /api/session/submit,
// /api/redflag/alert, /api/session/:id

app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
initSockets(server, CORS_ORIGIN);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(
      `[server] MediKiosk backend running on http://localhost:${PORT}`,
    );
    console.log(`[server] Socket.IO ready for doctor dashboard live updates`);
  });
});
