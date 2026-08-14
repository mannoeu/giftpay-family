/**
 * Decide a ação ao ativar/desativar notificações push.
 * Retorna `"noop" | "optIn" | "optOut" | "openSettings"`.
 */
export function resolvePushNotificationToggleAction({
  enabled,
  hasPermission,
  optedIn,
  canRequestPermission,
  nativePromptAlreadyAttempted = false,
}) {
  if (enabled) {
    if (hasPermission && optedIn) return "noop";
    if (!hasPermission && (!canRequestPermission || nativePromptAlreadyAttempted)) {
      return "openSettings";
    }
    return "optIn";
  }

  if (!optedIn) return "noop";
  return "optOut";
}
