const defaultSleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Reconsulta o status até a subscription estar ativa ou estourar o timeout.
 * OneSignal pode atrasar `optedIn`/token logo após `requestPermission` + `optIn`.
 * Retorna o último status lido.
 */
export async function waitForPushNotificationActive({
  getStatus,
  intervalMs = 250,
  timeoutMs = 5000,
  sleep = defaultSleep,
  now = () => Date.now(),
}) {
  const startedAt = now();
  let status = await getStatus();
  if (status?.isActive) return status;

  while (now() - startedAt < timeoutMs) {
    await sleep(intervalMs);
    status = await getStatus();
    if (status?.isActive) return status;
  }

  return status;
}
