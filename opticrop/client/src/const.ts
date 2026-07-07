export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  // For local development, just redirect to dashboard
  return `${window.location.origin}/dashboard`;
};
