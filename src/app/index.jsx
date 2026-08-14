import { Redirect } from "expo-router";

import { useAuthStore } from "@/store/auth";
import { resolveInitialHref } from "@/sdk/auth";
import { peekPendingPushNavigationHref } from "@/sdk/push-notification/schedule";

export default function Index() {
  const token = useAuthStore((state) => state.token);
  const isFirstAccess = useAuthStore((state) => state.isFirstAccess);

  return (
    <Redirect
      href={resolveInitialHref({
        isAuthenticated: !!token?.access_token,
        isFirstAccess,
        pendingHref: peekPendingPushNavigationHref(),
      })}
    />
  );
}
