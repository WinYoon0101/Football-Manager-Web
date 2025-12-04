/** Lưu token và user cho player (localStorage + cookie) */
export function setAuthToken(token: string, user: any) {
  if (typeof window === "undefined") return;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  const maxAge = 60 * 60 * 24;
  document.cookie = `token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

/** Lấy token hiện tại */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/** Lấy thông tin user hiện tại */
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

/** Xoá token và user */
export function clearAuth() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  document.cookie = "token=; path=/; max-age=0";
}


