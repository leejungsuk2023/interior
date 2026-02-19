const SESSION_KEY = "admin_session";

export function isAdminLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SESSION_KEY) === "1";
}

export function setAdminLoggedIn(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, "1");
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function checkAdminCredentials(id: string, password: string): boolean {
  const envId = import.meta.env.VITE_ADMIN_ID ?? "";
  const envPassword = import.meta.env.VITE_ADMIN_PASSWORD ?? "";
  if (!envId || !envPassword) return false;
  return id === envId && password === envPassword;
}
