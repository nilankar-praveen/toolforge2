import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
  timeout: 45000,
});

// Attach bearer token from localStorage when present (fallback for cross-site cookies)
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("tf_token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Retry a GET request up to N times to survive Render free-tier cold starts.
 * Waits between attempts to give the backend time to spin up.
 */
export async function apiGetWithRetry(path, options = {}, { attempts = 3, delayMs = 3000 } = {}) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      return await api.get(path, options);
    } catch (e) {
      lastErr = e;
      // Only retry on network/timeout errors, not on 4xx
      const status = e.response?.status;
      if (status && status < 500) throw e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, delayMs));
      }
    }
  }
  throw lastErr;
}

export function formatApiError(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}
