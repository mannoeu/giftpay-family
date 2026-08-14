/**
 * Após o SO conceder permissão, força re-registro da push subscription.
 * O ciclo optOut→optIn sincroniza a subscription com o servidor OneSignal.
 * Não retorna valor.
 */
export function forcePushSubscriptionRegistration({
  providerOptOut,
  providerOptIn,
}) {
  providerOptOut();
  providerOptIn();
}
