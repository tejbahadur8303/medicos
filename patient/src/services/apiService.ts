const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";

async function request<T>(path: string, method: string, body?: unknown, token?: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || `Request failed: ${res.status}`);
  return data.data;
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: unknown }>("/auth/login", "POST", { email, password }),

  // Doctors (public browsing)
  listDoctors: () => request<{ doctors: unknown[] }>("/doctors", "GET"),
  getDoctorById: (id: string) => request<{ doctor: unknown }>(`/doctors/${id}`, "GET"),
  getAvailableSlots: (id: string, date: string) =>
    request<{ slots: unknown[] }>(`/doctors/${id}/available-slots?date=${date}`, "GET"),

  // Appointments (patient)
  bookAppointment: (
    payload: { doctorId: string; date: string; startTime: string; reason: string },
    token: string
  ) => request<{ appointment: unknown }>("/appointments", "POST", payload, token),
  getMyAppointments: (token: string) =>
    request<{ appointments: unknown[] }>("/appointments/my", "GET", undefined, token),
  getAppointmentById: (id: string, token: string) =>
    request<{ appointment: unknown }>(`/appointments/${id}`, "GET", undefined, token),
  cancelAppointment: (id: string, token: string) =>
    request<{ appointment: unknown }>(`/appointments/${id}/cancel`, "PUT", undefined, token),
};