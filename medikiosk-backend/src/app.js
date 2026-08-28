import "dotenv/config";

import express from "express";
import cors from "cors";
import morgan from "morgan";

import { notFound, errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import intakeRoutes from "./routes/intake.js";
import miscRoutes from "./routes/misc.js";

const app = express();

const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10mb" }));

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    ok: true,
    service: "medikiosk-backend",
  });
});

// Doctor auth
app.use("/api/auth", authRoutes);

// Doctor dashboard routes
app.use("/api/patients", patientRoutes);

// Patient intake routes
app.use("/api", intakeRoutes);

// Notifications + doctor notes
app.use("/api", miscRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;
