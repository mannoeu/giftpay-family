import { useEffect } from "react";

import { useAuthStore } from "@/store/auth";
import { useUserQuery } from "@/queries/user";
import {
  addEmail,
  addTags,
  pushNotificationLogin,
} from "@/sdk/push-notification";

export const usePushNotificationIdentitySync = () => {
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = !!token?.access_token;

  const { data: user, isReady: userReady } = useUserQuery({
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const uuid = user?.extra_data?.onesignal_uuid ?? "";
    const email = user?.email ?? "";

    pushNotificationLogin(uuid);
    addEmail(email);
    addTags({ uuid });
  }, [
    isAuthenticated,
    user?.extra_data?.onesignal_uuid,
    user?.email,
    userReady,
  ]);
};
