/**
 * Client-side utility to read the CSRF token from the csrf-token cookie.
 * Used by components that make mutating API calls (POST/PATCH/DELETE).
 */
export function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf-token=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}
