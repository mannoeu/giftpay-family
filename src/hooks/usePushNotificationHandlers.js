import { useEffect } from "react";

import {
  mapPushNotificationToPresentation,
  presentForegroundPushNotification,
  resolveForegroundPushNotification,
} from "@/sdk/push-notification/presentation/foreground";
import {
  runPushNotificationClick,
  runPushNotificationReceived,
} from "@/sdk/push-notification/registry/runtime";
import {
  registerPushNotificationHandlers,
  unregisterPushNotificationHandlers,
} from "@/sdk/push-notification/service";

export const usePushNotificationHandlers = ({
  onClick,
  onForegroundWillDisplay,
  onPermissionChange,
} = {}) => {
  useEffect(() => {
    const handleForegroundWillDisplay = (event) => {
      const notification = resolveForegroundPushNotification(event);
      const presentation = mapPushNotificationToPresentation(notification);

      runPushNotificationReceived(presentation);
      presentForegroundPushNotification(event);
      onForegroundWillDisplay?.(event);
    };

    const handleClick = (event) => {
      const notification = resolveForegroundPushNotification(event);
      const presentation = mapPushNotificationToPresentation(notification);

      runPushNotificationClick(presentation);
      onClick?.(event);
    };

    registerPushNotificationHandlers({
      onClick: handleClick,
      onForegroundWillDisplay: handleForegroundWillDisplay,
      onPermissionChange,
    });

    return () => {
      unregisterPushNotificationHandlers();
    };
  }, [onClick, onForegroundWillDisplay, onPermissionChange]);
};
