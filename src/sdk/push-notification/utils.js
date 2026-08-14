import { useAuthStore } from "@/store/auth";

/**
 * Sessão ativa (access_token) — gate para schedule, invalidação de cache, etc.
 */
export function isAuthenticated() {
  return Boolean(useAuthStore.getState()?.token?.access_token);
}
