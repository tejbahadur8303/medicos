const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://medikiosk-backend.vercel.app/api";

async function request<T>(
  path: string,
  method: string,
  body?: unknown,
  token?: string,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || data.error || `Request failed: ${res.status}`,
    );
  }

  // APIs that return { data: ... }
  if (data && typeof data === "object" && "data" in data) {
    return data.data;
  }

  return data;
}

export const api = {
  // =========================
  // Auth
  // =========================

login: (email: string, password: string) =>
  request<{
    token: string;
    doctor: unknown;
    user?: unknown;
  }>("/auth/login", "POST", {
    email,
    password,
  }),

  // =========================
  // Doctors
  // =========================

  listDoctors: () => request<{ doctors: unknown[] }>("/doctors", "GET"),

  getDoctorById: (id: string) =>
    request<{ doctor: unknown }>(`/doctors/${id}`, "GET"),

  getAvailableSlots: (id: string, date: string) =>
    request<{ slots: unknown[] }>(
      `/doctors/${id}/available-slots?date=${date}`,
      "GET",
    ),

  // =========================
  // Appointments
  // =========================

  bookAppointment: (
    payload: {
      doctorId: string;
      date: string;
      startTime: string;
      reason: string;
    },
    token: string,
  ) =>
    request<{ appointment: unknown }>("/appointments", "POST", payload, token),

  getMyAppointments: (token: string) =>
    request<{ appointments: unknown[] }>(
      "/appointments/my",
      "GET",
      undefined,
      token,
    ),

  getAppointmentById: (id: string, token: string) =>
    request<{ appointment: unknown }>(
      `/appointments/${id}`,
      "GET",
      undefined,
      token,
    ),

  cancelAppointment: (id: string, token: string) =>
    request<{ appointment: unknown }>(
      `/appointments/${id}/cancel`,
      "PUT",
      undefined,
      token,
    ),

  // =========================
  // Patient Intake
  // =========================

  // Create patient immediately after registration
  createSession: (payload: {
    name: string;
    age: number;
    gender: string;
    mobileNumber: string;
    abhaId?: string;
    language?: string;
    isGuest?: boolean;
    consent?: {
      given: boolean;
    };
  }) =>
    request<{
      sessionId: string;
      token: string;
      ok: boolean;
    }>("/patient/session", "POST", payload),

  // Submit completed intake session
  submitSession: (payload: unknown) =>
    request<unknown>("/session/submit", "POST", payload),

  // Red flag alert
  alertRedFlag: (payload: { patientId: string; redFlags: unknown[] }) =>
    request<{ ok: boolean }>("/redflag/alert", "POST", payload),
};
