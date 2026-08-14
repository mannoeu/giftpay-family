import { router } from "expo-router";

import { isAuthenticated } from "@/sdk/push-notification/utils";

const DEDUPE_MS = 800;

let pendingHref = null;
let lastScheduledHref = null;
let lastScheduledAt = 0;

/** Rota do grupo `(private)` — exige sessão para navegar. */
export function isPrivatePushRoute(href) {
  return typeof href === "string" && href.includes("(private)");
}

/** Rota do grupo `(public)` — pode navegar deslogado. */
export function isPublicPushRoute(href) {
  return typeof href === "string" && href.includes("(public)");
}

function canNavigateToHref(href) {
  if (isPublicPushRoute(href)) return true;
  if (isPrivatePushRoute(href)) return isAuthenticated();
  return isAuthenticated();
}

export function clearPendingPushNavigation() {
  pendingHref = null;
  lastScheduledHref = null;
  lastScheduledAt = 0;
}

export function hasPendingPushNavigation() {
  return pendingHref != null;
}

export function peekPendingPushNavigationHref() {
  return pendingHref;
}

/** Consome o href pendente sem navegar (ex.: auth guard faz replace direto). */
export function consumePendingPushNavigationHref() {
  const href = pendingHref;
  pendingHref = null;
  return href;
}

/**
 * Tenta `router.navigate` no href pendente.
 * Private sem sessão: mantém pendência.
 */
export function flushPendingPushNavigation() {
  if (!pendingHref) return false;
  if (!canNavigateToHref(pendingHref)) return false;

  const href = pendingHref;
  try {
    router.navigate(href);
    pendingHref = null;
    return true;
  } catch {
    return false;
  }
}

/**
 * Agenda navegação a partir de push.
 * - Public: navega mesmo deslogado.
 * - Private deslogado: fica pendente até o login + flush.
 * Deduplica o mesmo href em janela curta.
 */
export function schedulePushNavigation(href) {
  if (!href) return;

  const now = Date.now();
  if (
    href === lastScheduledHref &&
    now - lastScheduledAt < DEDUPE_MS &&
    !pendingHref
  ) {
    return;
  }

  if (href === pendingHref) {
    flushPendingPushNavigation();
    return;
  }

  lastScheduledHref = href;
  lastScheduledAt = now;
  pendingHref = href;
  flushPendingPushNavigation();
}
