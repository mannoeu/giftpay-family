/** API pública reexportada de `@/sdk/push-notification`. */
export {
  initPushNotificationService,
  isPushNotificationSupported,
  checkPushNotificationPermissionStatus,
  requestPushNotificationPermission,
  openPushNotificationSettings,
  setPushNotificationEnabled,
  pushNotificationLogin,
  pushNotificationLogout,
  addEmail,
  removeEmail,
  addTags,
  removeTag,
  clearTags,
  registerPushNotificationHandlers,
  unregisterPushNotificationHandlers,
} from "@/sdk/push-notification/service";

export {
  shouldOfferPermissionPromptThisSession,
  markPermissionPromptOfferedThisSession,
  resetPermissionPromptSessionState,
} from "@/sdk/push-notification/permission/sessionPrompt";

export {
  resolveNativePermissionGate,
  hasAttemptedNativePermissionPromptThisSession,
  markNativePermissionPromptAttemptedThisSession,
  resetNativePermissionPromptAttemptState,
} from "@/sdk/push-notification/permission/nativePromptGate";

export {
  presentForegroundPushNotification,
  mapPushNotificationToPresentation,
  resolveForegroundPushNotification,
} from "@/sdk/push-notification/presentation/foreground";

export {
  PushNotificationType,
  PushNotificationRegistry,
} from "@/sdk/push-notification/registry";

export {
  parsePushNotificationType,
  shouldOpenGenericForegroundPushSheet,
  runPushNotificationReceived,
  runPushNotificationClick,
  resolvePushSheetButtons,
} from "@/sdk/push-notification/registry/runtime";
