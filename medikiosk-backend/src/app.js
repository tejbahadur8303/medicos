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

/*
|--------------------------------------------------------------------------
| CORS
|--------------------------------------------------------------------------
*/

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow curl / Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      // Allow origins from CORS_ORIGIN
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Allow local Vite development ports
      if (
        origin === "http://localhost:3000" ||
        origin === "http://localhost:3001" ||
        origin === "http://localhost:3002" ||
        origin === "http://localhost:3003" ||
        origin === "http://localhost:5173"
      ) {
        return callback(null, true);
      }

      // Allow Vercel deployments
      if (/^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      console.log(`[CORS] Blocked origin: ${origin}`);

      return callback(new Error(`CORS blocked: ${origin}`));
    },

    credentials: true,

    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],

    optionsSuccessStatus: 204,
  }),
);

/*
|--------------------------------------------------------------------------
| Body Parser
|--------------------------------------------------------------------------
*/

app.use(express.json({ limit: "10mb" }));

app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/*
|--------------------------------------------------------------------------
| Logger
|--------------------------------------------------------------------------
*/

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "medikiosk-backend",
    message: "Backend is running",
  });
});

/*
|--------------------------------------------------------------------------
| Doctor Authentication
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);

/*
|--------------------------------------------------------------------------
| Doctor Dashboard
|--------------------------------------------------------------------------
*/

app.use("/api/patients", patientRoutes);

/*
|--------------------------------------------------------------------------
| Patient Intake
|--------------------------------------------------------------------------
*/

app.use("/api", intakeRoutes);

/*
|--------------------------------------------------------------------------
| Notifications + Doctor Notes
|--------------------------------------------------------------------------
*/

app.use("/api", miscRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use(notFound);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use(errorHandler);

export default app;