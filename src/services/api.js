import axios from "axios";

import { useAuthStore } from "@/store/auth";
import { createFeedback } from "@/sdk/apiErrors";
import {
  forceLogout,
  getRefreshPromiseIfAny,
  getOrRunRefresh,
  isLoginOrRefreshEndpoint,
} from "@/services/refreshToken";

const apiConfig = {
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = axios.create(apiConfig);

api.interceptors.request.use(
  (config) => {
    const refreshPromise = getRefreshPromiseIfAny();
    if (refreshPromise) {
      return refreshPromise.then((result) => {
        if (!result.success)
          return Promise.reject(new Error("Session expired"));
        const { token } = useAuthStore.getState();
        if (token?.access_token && config.headers) {
          config.headers.Authorization = `Bearer ${token.access_token}`;
        }
        return config;
      });
    }

    const { token } = useAuthStore.getState();

    if (!config?.headers?.Authorization && !!token?.access_token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const config = error.config;

    const is401 = status === 401;
    const isLoginOrRefresh = isLoginOrRefreshEndpoint(config?.url);
    const is401RefreshFlow = is401 && !isLoginOrRefresh;

    const feedback = createFeedback({
      status: error?.response?.status,
      response: error?.response?.data,
      notify: is401RefreshFlow
        ? false
        : !error?.response?.config?.headers?.["silent"],
      canceled: error?.code === "ERR_CANCELED",
    });

    if (is401) {
      if (isLoginOrRefresh) {
        error.feedback = feedback;
        return Promise.reject(error);
      }

      return getOrRunRefresh(apiConfig).then((result) => {
        if (result.success) {
          delete config.headers.Authorization;
          return api.request(config);
        }
        return forceLogout();
      });
    }

    error.feedback = feedback;

    return Promise.reject(error);
  }
);
