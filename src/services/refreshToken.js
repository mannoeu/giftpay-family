import axios from "axios";

import { useAuthStore } from "@/store/auth";
import { ToastInfo } from "@/sdk/toast";
import { handleLogout } from "@/sdk/session";

let refreshPromise = null;

export function forceLogout() {
  ToastInfo("Sua sessão expirou, faça login novamente.");
  return handleLogout();
}

export function isLoginOrRefreshEndpoint(url) {
  return url?.includes("login/token");
}

export function getRefreshPromiseIfAny() {
  return refreshPromise ?? null;
}

export function getOrRunRefresh(apiConfig) {
  if (!refreshPromise) {
    refreshPromise = runRefresh(apiConfig);
  }
  return refreshPromise;
}

async function runRefresh(apiConfig) {
  const { token, setAccessToken, setRefreshingToken } = useAuthStore.getState();

  setRefreshingToken(true);

  try {
    if (!token?.refresh_token) {
      return { success: false };
    }

    const { data } = await axios.post(
      `${apiConfig.baseURL}/login/token/refresh/`,
      { refresh: token?.refresh_token },
      { headers: apiConfig.headers }
    );

    setAccessToken({ access_token: data?.access });

    return { success: true };
  } catch {
    return { success: false };
  } finally {
    setRefreshingToken(false);
    refreshPromise = null;
  }
}
