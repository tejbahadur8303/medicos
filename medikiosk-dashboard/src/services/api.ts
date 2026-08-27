import axios from 'axios';

/**
 * Base Axios instance for all backend calls. The base URL comes from an
 * environment variable so no URL is ever hardcoded in source — see
 * .env (VITE_API_BASE_URL). Never put API keys or DB credentials here;
 * those belong on the Node.js backend only.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Set to true automatically whenever a real API call fails, so the app
 * can fall back to demo/mock data instead of showing a blank dashboard.
 * This is a deliberate hackathon-mode safety net, not a production
 * pattern — a production build would surface the error state instead.
 */
export let backendUnavailable = false;

export function markBackendUnavailable(value: boolean) {
  backendUnavailable = value;
}

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
