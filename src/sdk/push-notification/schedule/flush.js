import { resolveAuthRedirect } from "@/sdk/auth";
import { flushPendingPushNavigation } from "@/sdk/push-notification/schedule/navigation";
import { flushPendingOpenSheet } from "@/sdk/push-notification/schedule/sheet";

/**
 * Flusha sheet de push e, se o auth guard não for redirecionar, a navegação.
 * Ainda no grupo public após login, o guard consome o href no replace —
 * flushar aqui esvazia a pendência e o replace da Home ganha a corrida.
 * Segments vazios = navigator assentando; não flusha.
 */
export function flushPendingPushWhenReady({
  navigationReady,
  isAuthenticated,
  isFirstAccess = false,
  segments = [],
}) {
  if (!navigationReady || isFirstAccess || !segments[0]) return;

  const authRedirectHref = resolveAuthRedirect({
    isAuthenticated,
    isFirstAccess,
    segments,
  });

  if (!authRedirectHref) {
    flushPendingPushNavigation();
  }

  flushPendingOpenSheet();
}
