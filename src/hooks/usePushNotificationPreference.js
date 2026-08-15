import { useState, useCallback, useEffect } from "react";

import {
  checkPushNotificationPermissionStatus,
  setPushNotificationEnabled,
  isPushNotificationSupported,
} from "@/sdk/push-notification";

export const usePushNotificationPreference = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({
    hasPermission: false,
    optedIn: false,
    canRequestPermission: false,
    isActive: false,
  });

  const isSupported = isPushNotificationSupported();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const s = await checkPushNotificationPermissionStatus();
      setStatus(s);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setEnabled = useCallback(
    async (enabled) => {
      const result = await setPushNotificationEnabled(enabled);
      setStatus({
        hasPermission: result.hasPermission,
        optedIn: result.optedIn,
        canRequestPermission: result.canRequestPermission,
        isActive: result.isActive,
      });
      return result;
    },
    [],
  );

  return {
    isLoading,
    isSupported,
    isActive: status.isActive,
    hasPermission: status.hasPermission,
    optedIn: status.optedIn,
    canRequestPermission: status.canRequestPermission,
    setEnabled,
    refresh,
  };
};
