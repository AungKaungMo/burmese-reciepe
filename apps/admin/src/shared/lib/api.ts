import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Shared axios instance for the backend API (`/v1/*`).
 *
 * Pure HTTP setup — no auth provider knowledge. Call `setAuthToken` to attach or
 * clear the bearer token (the auth layer wires this from the Supabase session).
 * The response interceptor unwraps the shared success envelope (`{ success, code,
 * data }`) down to `data`, and collapses the error envelope (`{ success: false,
 * message }`) into a plain `Error` for the UI.
 */
export const api = axios.create({
  baseURL,
});

/** Set (or clear, with `null`) the Authorization header used on every request. */
export function setAuthToken(token: string | null): void {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

api.interceptors.response.use(
  (response) => {
    const envelope = response.data as unknown;
    // Unwrap `{ success, code, data }` so callers receive `data` directly.
    if (
      envelope &&
      typeof envelope === 'object' &&
      'success' in envelope &&
      'data' in envelope
    ) {
      response.data = (envelope as { data: unknown }).data;
    }
    return response;
  },
  (error: AxiosError<{ message?: string; error?: { message?: string } }>) => {
    const payload = error.response?.data;
    const message =
      payload?.message ?? payload?.error?.message ?? error.message ?? 'Request failed.';

    return Promise.reject(new Error(message));
  },
);
