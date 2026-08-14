import { PushNotificationRegistry } from "@/sdk/push-notification/registry";
import { useSheet } from "@/store/sheet";

/** Lê e normaliza `additionalData.type` do payload. */
export function parsePushNotificationType(additionalData) {
  const type = additionalData?.type;
  if (typeof type !== "string") return null;
  const normalized = type.trim();
  return normalized.length ? normalized : null;
}

function getPushNotificationRegistryEntry(presentation) {
  const type = parsePushNotificationType(presentation?.additionalData);
  if (!type) return null;
  return PushNotificationRegistry[type] ?? null;
}

/**
 * Indica se a notificação deve abrir o sheet genérico de push em foreground.
 */
export function shouldOpenGenericForegroundPushSheet(presentation) {
  const entry = getPushNotificationRegistryEntry(presentation);
  return Boolean(entry?.openAsGenericSheetWhenInForeground);
}

/** Dispara `onNotificationReceived` da entry quando a push chega em foreground. */
export function runPushNotificationReceived(presentation) {
  const entry = getPushNotificationRegistryEntry(presentation);
  entry?.onNotificationReceived?.(presentation);
}

/** Dispara `onNotificationClick` da entry quando o usuário toca na notificação. */
export function runPushNotificationClick(presentation) {
  const entry = getPushNotificationRegistryEntry(presentation);
  entry?.onNotificationClick?.(presentation);
}

function createPushButtonMap(actionButtons = []) {
  return actionButtons.reduce((acc, button) => {
    acc[button.id] = {
      id: button.id,
      text: button.text,
      show: false,
      onPress: null,
    };
    return acc;
  }, {});
}

function normalizePushSheetActionsDirection(direction) {
  return direction === "column" ? "column" : "row";
}

/** Aplica `mapButtons` da entry e monta a lista para o sheet. */
export function resolvePushSheetButtons(presentation) {
  const entry = getPushNotificationRegistryEntry(presentation);
  const buttonMap = createPushButtonMap(presentation.actionButtons);

  let direction;

  if (entry?.mapButtons) {
    const mapResult = entry.mapButtons(buttonMap, presentation);
    direction = mapResult?.direction;
  } else {
    presentation.actionButtons.forEach((button) => {
      if (buttonMap[button.id]) {
        buttonMap[button.id].show = true;
        buttonMap[button.id].onPress = () => useSheet.getState().closeSheet();
      }
    });
  }

  const visibleButtons = Object.values(buttonMap).filter((btn) => btn.show);

  return {
    visibleButtons,
    direction:
      direction !== undefined
        ? normalizePushSheetActionsDirection(direction)
        : undefined,
  };
}
