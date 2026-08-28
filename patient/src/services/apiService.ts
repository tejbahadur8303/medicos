const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

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
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data.message || data.error || `Request failed: ${res.status}`,
    );
  }

  // Backend sometimes returns { success, data }
  // and intake APIs return { ok, ...data }
  if ("data" in data) {
    return data.data;
  }

  return data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: unknown }>("/auth/login", "POST", {
      email,
      password,
    }),

  // Doctors
  listDoctors: () =>
    request<{ doctors: unknown[] }>("/doctors", "GET"),

  getDoctorById: (id: string) =>
    request<{ doctor: unknown }>(`/doctors/${id}`, "GET"),

  getAvailableSlots: (id: string, date: string) =>
    request<{ slots: unknown[] }>(
      `/doctors/${id}/available-slots?date=${date}`,
      "GET",
    ),

  // Appointments
  bookAppointment: (
    payload: {
      doctorId: string;
      date: string;
      startTime: string;
      reason: string;
    },
    token: string,
  ) =>
    request<{ appointment: unknown }>(
      "/appointments",
      "POST",
      payload,
      token,
    ),

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

  // Patient Intake
  submitSession: (payload: unknown) =>
    request<unknown>(
      "/session/submit",
      "POST",
      payload,
    ),

  alertRedFlag: (payload: {
    patientId: string;
    redFlags: unknown[];
  }) =>
    request<{ ok: boolean }>(
      "/redflag/alert",
      "POST",
      payload,
    ),
};