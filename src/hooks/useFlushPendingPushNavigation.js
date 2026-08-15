import { useEffect } from "react";
import { useRootNavigationState, useSegments } from "expo-router";

import { useAuthStore } from "@/store/auth";
import { flushPendingPushWhenReady } from "@/sdk/push-notification/schedule/flush";

/**
 * Flusha navegação e sheet de push pendentes quando o navigator está pronto.
 * Private / sheet sem sessão permanecem pendentes até o login.
 * Ainda no login após autenticar, a navegação fica para o auth guard.
 */
export function useFlushPendingPushNavigation() {
  const navigationState = useRootNavigationState();
  const segments = useSegments();
  const token = useAuthStore((state) => state.token);
  const isFirstAccess = useAuthStore((state) => state.isFirstAccess);
  const isAuthenticated = !!token?.access_token;
  const navigationReady = !!navigationState?.key;

  useEffect(() => {
    flushPendingPushWhenReady({
      navigationReady,
      isAuthenticated,
      isFirstAccess,
      segments,
    });
  }, [navigationReady, isAuthenticated, isFirstAccess, segments]);
}
