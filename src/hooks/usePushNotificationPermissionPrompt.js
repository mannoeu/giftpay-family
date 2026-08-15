import { useCallback, useEffect, useRef } from "react";
import { AppState } from "react-native";

import { useFocusEffect } from "expo-router";

import {
  checkPushNotificationPermissionStatus,
  isPushNotificationSupported,
  markPermissionPromptOfferedThisSession,
  shouldOfferPermissionPromptThisSession,
} from "@/sdk/push-notification";
import { PermissionPromptSheet } from "@/components/sheets/permissionPromptSheet";
import { useSheet } from "@/store/sheet";

export const usePushNotificationPermissionPrompt = () => {
  const openSheet = useSheet((state) => state.openSheet);
  const checking = useRef(false);

  const checkAndMaybePrompt = useCallback(async () => {
    if (!isPushNotificationSupported()) return;
    if (checking.current) return;

    checking.current = true;
    try {
      const status = await checkPushNotificationPermissionStatus();

      if (!shouldOfferPermissionPromptThisSession({ isActive: status.isActive })) {
        return;
      }

      markPermissionPromptOfferedThisSession();
      openSheet(<PermissionPromptSheet />);
    } finally {
      checking.current = false;
    }
  }, [openSheet]);

  useFocusEffect(
    useCallback(() => {
      checkAndMaybePrompt();
    }, [checkAndMaybePrompt]),
  );

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        checkAndMaybePrompt();
      }
    });

    return () => subscription.remove();
  }, [checkAndMaybePrompt]);
};
