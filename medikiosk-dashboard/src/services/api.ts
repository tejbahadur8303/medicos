import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://medikiosk-backend.vercel.app/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export let backendUnavailable = false;

export function markBackendUnavailable(value: boolean) {
  backendUnavailable = value;
}

// Automatically attach JWT token to protected API requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("medikiosk_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    backendUnavailable = false;
    return response;
  },
  (error) => {
    backendUnavailable = true;

    console.error(
      "API Error:",
      error.response?.status,
      error.response?.data || error.message,
    );

    return Promise.reject(error);
  },
);