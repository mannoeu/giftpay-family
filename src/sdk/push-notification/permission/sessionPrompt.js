/**
 * Estado em memória da sessão do app.
 * Controla o sheet de solicitar permissão: no máximo 1 oferta por sessão.
 */

let offeredThisSession = false;

/** Decide se ainda podemos oferecer o sheet de permissão nesta sessão. */
export function shouldOfferPermissionPromptThisSession({ isActive }) {
  if (isActive) return false;
  if (offeredThisSession) return false;
  return true;
}

/** Marca que o prompt já foi oferecido nesta sessão. */
export function markPermissionPromptOfferedThisSession() {
  offeredThisSession = true;
}

/** Reseta o estado de sessão (só para testes). */
export function resetPermissionPromptSessionState() {
  offeredThisSession = false;
}
