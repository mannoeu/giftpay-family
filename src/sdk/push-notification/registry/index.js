import { PushNotificationType } from "@/sdk/push-notification/registry/types";

export { PushNotificationType } from "@/sdk/push-notification/registry/types";

/**
 * Contrato de cada entrada — implemente em `registry/entries/<nome>/index.js`.
 *
 * @typedef {import('@/sdk/push-notification/presentation/foreground').PushNotificationPresentation} PushNotificationPresentation
 *
 * @typedef {Object} MappedPushButton
 * @property {string} id
 * @property {string} text
 * @property {boolean} show
 * @property {(() => void)|null} onPress
 *
 * @typedef {Record<string, MappedPushButton>} PushButtonMap
 *
 * @typedef {Object} PushNotificationRegistryEntry
 * @property {boolean} [openAsGenericSheetWhenInForeground]
 * @property {(notification: PushNotificationPresentation) => void} [onNotificationReceived]
 * @property {(notification: PushNotificationPresentation) => void} [onNotificationClick]
 * @property {(buttons: PushButtonMap, notification: PushNotificationPresentation) => { direction?: 'row'|'column' }|void} [mapButtons]
 */

/** @type {Record<string, PushNotificationRegistryEntry>} */
export const PushNotificationRegistry = {
  // Exemplo de entry:
  // [PushNotificationType.MY_TYPE]: myTypeEntry,
};
