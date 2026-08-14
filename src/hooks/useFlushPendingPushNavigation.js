import { useEffect } from "react";
import { useRootNavigationState } from "expo-router";

import { useAuthStore } from "@/store/auth";
import {
  flushPendingPushNavigation,
  flushPendingOpenSheet,
} from "@/sdk/push-notification/schedule";

/**
 * Flusha navegação e sheet de push pendentes quando o navigator está pronto.
 * Private / sheet sem sessão permanecem pendentes até o login.
 */
export function useFlushPendingPushNavigation() {
  const navigationState = useRootNavigationState();
  const token = useAuthStore((state) => state.token);
  const isFirstAccess = useAuthStore((state) => state.isFirstAccess);
  const isAuthenticated = !!token?.access_token;
  const navigationReady = !!navigationState?.key;

  useEffect(() => {
    if (!navigationReady || isFirstAccess) return;
    flushPendingPushNavigation();
    flushPendingOpenSheet();
  }, [navigationReady, isAuthenticated, isFirstAccess]);
}
