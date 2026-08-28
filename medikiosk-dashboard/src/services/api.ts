import axios from 'axios';

export const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export let backendUnavailable = false;

export function markBackendUnavailable(value: boolean) {
  backendUnavailable = value;
}

// Automatically attach JWT token to protected API requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('medikiosk_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    backendUnavailable = false;
    return response;
  },
  (error) => {
    backendUnavailable = true;
    return Promise.reject(error);
  },
);