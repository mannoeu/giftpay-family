import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Storage } from "@/sdk/storage";

export const partializeAuthSession = (state) => {
  if (state.isFirstAccess) {
    return { token: null, user: null };
  }

  return {
    token: state.token,
    user: state.user,
  };
};

export const useAuthStore = create(
  persist(
    immer((set) => ({
      token: null,
      user: null,
      isRefreshingToken: false,
      isFirstAccess: false,
      setToken: ({ access_token, refresh_token, isFirstAccess = false }) => {
        set((state) => {
          state.token = { access_token, refresh_token };
          state.isFirstAccess = !!isFirstAccess;
        });
      },
      setFirstAccess: (isFirstAccess) => {
        set((state) => {
          state.isFirstAccess = !!isFirstAccess;
        });
      },
      setRefreshingToken: (isRefreshing) => {
        set((state) => {
          state.isRefreshingToken = isRefreshing;
        });
      },
      setAccessToken: ({ access_token }) => {
        set((state) => {
          state.token = { ...state.token, access_token };
        });
      },
      setUser: (user) => {
        set((state) => {
          state.user = user;
        });
      },
      signOut: () => {
        set((state) => {
          state.token = null;
          state.user = null;
          state.isFirstAccess = false;
        });
      },
    })),
    {
      name: "@giftpay-family/session",
      storage: createJSONStorage(() => Storage),
      partialize: partializeAuthSession,
    },
  ),
);
