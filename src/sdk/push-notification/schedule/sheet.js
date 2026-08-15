import { useSheet } from "@/store/sheet";

import { isAuthenticated } from "@/sdk/push-notification/utils";

let pendingContent = null;

export function clearPendingOpenSheet() {
  pendingContent = null;
}

export function hasPendingOpenSheet() {
  return pendingContent != null;
}

/**
 * Abre o sheet pendente se houver sessão.
 * Sem sessão: mantém a pendência para após o login.
 */
export function flushPendingOpenSheet() {
  if (!pendingContent) return false;
  if (!isAuthenticated()) return false;

  const opened = useSheet.getState().openSheet(pendingContent);
  if (!opened) return false;

  pendingContent = null;
  return true;
}

/**
 * Abre um sheet só com sessão.
 * Deslogado: agenda e abre no flush após login.
 */
export function scheduleOpenSheet(content) {
  if (content == null) return;

  pendingContent = content;
  flushPendingOpenSheet();
}
