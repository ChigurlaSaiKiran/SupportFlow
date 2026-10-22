export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5213";

export const INACTIVITY_TIMEOUT_MS =
  Number(process.env.REACT_APP_INACTIVITY_TIMEOUT_MS) || 5 * 60 * 1000;
