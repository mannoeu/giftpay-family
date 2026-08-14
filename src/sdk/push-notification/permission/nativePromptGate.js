/**
 * Gate do dialog nativo de permissão.
 * `canRequestPermission` do OneSignal/SO às vezes continua `true` depois que o
 * dialog já não abre. Por isso rastreamos se já tentamos nesta sessão.
 */

let attemptedThisSession = false;

/**
 * Decide o caminho para obter permissão do SO.
 * Retorna `"granted" | "requestNative" | "openSettings"`.
 */
export function resolveNativePermissionGate({
  hasPermission,
  canRequestPermission,
  alreadyAttempted,
}) {
  if (hasPermission) return "granted";
  if (!canRequestPermission || alreadyAttempted) return "openSettings";
  return "requestNative";
}

export function hasAttemptedNativePermissionPromptThisSession() {
  return attemptedThisSession;
}

export function markNativePermissionPromptAttemptedThisSession() {
  attemptedThisSession = true;
}

/** Só para testes. */
export function resetNativePermissionPromptAttemptState() {
  attemptedThisSession = false;
}
