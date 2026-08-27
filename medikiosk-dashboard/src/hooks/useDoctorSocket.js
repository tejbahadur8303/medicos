import { io } from "socket.io-client";
import { useEffect } from "react";

// Every event your backend already emits from intakeController.js.
// Add to this list only if you add a new emitToDoctors(...) call later.
const PATIENT_EVENTS = [
  "patient:new",
  "patient:updated",
  "patient:priority",
  "patient:summary-ready",
  "patient:submitted",
];

/**
 * Connects once to the backend socket and calls `onPatientEvent`
 * whenever ANY patient-related event fires. Kept deliberately dumb —
 * it doesn't try to merge partial payloads (some events only send
 * patientId/name/token, not the full record) — it just tells the
 * caller "something changed, go refetch."
 */
export function useDoctorSocket(onPatientEvent) {
  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_BASE_URL, {
      withCredentials: true, // must match cors({ credentials: true }) in server.js
    });

    PATIENT_EVENTS.forEach((event) => {
      socket.on(event, (payload) => onPatientEvent(event, payload));
    });

    socket.on("connect_error", (err) => {
      console.error("[socket] connection error:", err.message);
    });

    return () => socket.disconnect();
  }, [onPatientEvent]);
}