/**
 * Utility functions for authentication
 */

/**
 * Set authentication token in both cookie and localStorage
 * Cookie is for server-side middleware access
 * localStorage is for client-side access
 */
export function setAuthToken(token: string, user: any) {
  if (typeof window === "undefined") return;

  // Lưu vào localStorage
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  // Lưu vào cookie để middleware có thể đọc được
  const maxAge = 60 * 60 * 24; // 24 hours
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/**
 * Get authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Get user from localStorage
 */
export function getAuthUser() {
  if (typeof window === "undefined") return null;
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * Clear authentication data
 */
export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  // Clear cookie
  document.cookie = "token=; path=/; max-age=0";
}
