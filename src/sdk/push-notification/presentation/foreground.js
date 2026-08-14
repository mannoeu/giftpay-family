import React from "react";

import { useSheet } from "@/store/sheet";
import {
  resolvePushSheetButtons,
  shouldOpenGenericForegroundPushSheet,
} from "@/sdk/push-notification/registry/runtime";
import { ForegroundPushNotificationSheet } from "@/components/sheets/foregroundPushNotificationSheet";

/** Extrai o objeto de notificação do evento OneSignal. */
export function resolveForegroundPushNotification(event) {
  if (!event) return null;
  if (typeof event.getNotification === "function") {
    return event.getNotification();
  }
  return event.notification ?? null;
}

function parseRawPayloadObject(rawPayload) {
  if (!rawPayload || typeof rawPayload !== "string") return null;
  try {
    return JSON.parse(rawPayload);
  } catch {
    return null;
  }
}

function parseOnesignalCustomFromRawPayload(rawPayload) {
  const payload = parseRawPayloadObject(rawPayload);
  if (!payload) return null;

  let custom = payload.custom;
  if (typeof custom === "string") {
    try {
      custom = JSON.parse(custom);
    } catch {
      return null;
    }
  }

  return custom?.a ?? custom ?? null;
}

function isHttpUrl(value) {
  return typeof value === "string" && /^https?:\/\//i.test(value.trim());
}

function pickFirstImageUrl(candidates) {
  for (const candidate of candidates) {
    if (isHttpUrl(candidate)) {
      return candidate.trim();
    }
  }
  return null;
}

export function parsePushNotificationImageUrl(notification) {
  if (!notification) return null;

  const rawPayload = parseRawPayloadObject(notification.rawPayload);
  const custom = parseOnesignalCustomFromRawPayload(notification.rawPayload);
  const additionalData =
    notification.additionalData &&
    typeof notification.additionalData === "object"
      ? notification.additionalData
      : custom;

  return pickFirstImageUrl([
    notification.bigPicture,
    notification.largeIcon,
    additionalData?.bigPicture,
    additionalData?.big_picture,
    additionalData?.image,
    additionalData?.img,
    additionalData?.imageUrl,
    additionalData?.attachment,
    rawPayload?.bicon,
    rawPayload?.big_picture,
    rawPayload?.image,
  ]);
}

function normalizeActionButtons(buttons) {
  if (!Array.isArray(buttons)) return [];
  return buttons
    .map((button) => ({
      id: String(button?.id ?? button?.actionId ?? button?.actionID ?? ""),
      text: String(button?.text ?? button?.label ?? "").trim(),
    }))
    .filter((button) => button.text);
}

export function parsePushNotificationAdditionalData(notification) {
  if (!notification) return {};

  if (notification.additionalData && typeof notification.additionalData === "object") {
    return notification.additionalData;
  }

  const custom = parseOnesignalCustomFromRawPayload(notification.rawPayload);
  if (custom && typeof custom === "object") {
    const { actionButtons: _ignored, ...rest } = custom;
    return rest;
  }

  return {};
}

export function parsePushNotificationActionButtons(notification) {
  if (!notification) return [];

  const direct = normalizeActionButtons(notification.actionButtons);
  if (direct.length) return direct;

  const fromAdditional = normalizeActionButtons(notification.additionalData?.actionButtons);
  if (fromAdditional.length) return fromAdditional;

  const custom = parseOnesignalCustomFromRawPayload(notification.rawPayload);
  return normalizeActionButtons(custom?.actionButtons ?? custom?.actions ?? []);
}

/**
 * @typedef {Object} PushNotificationPresentation
 * @property {string|null} notificationId
 * @property {string} title
 * @property {string} body
 * @property {Array<{ id: string, text: string }>} actionButtons
 * @property {Record<string, unknown>} additionalData
 * @property {string|null} launchURL
 * @property {string|null} imageUrl
 */

/** Converte a notificação nativa no formato usado pelo registry e pelo sheet. */
export function mapPushNotificationToPresentation(notification) {
  if (!notification) {
    return {
      notificationId: null,
      title: "",
      body: "",
      actionButtons: [],
      additionalData: {},
      launchURL: null,
      imageUrl: null,
    };
  }

  return {
    notificationId: notification.notificationId ?? null,
    title: notification.title?.trim() ?? "",
    body: notification.body?.trim() ?? "",
    actionButtons: parsePushNotificationActionButtons(notification),
    additionalData: parsePushNotificationAdditionalData(notification),
    launchURL: notification.launchURL ?? null,
    imageUrl: parsePushNotificationImageUrl(notification),
  };
}

/** Garante que a push em foreground apareça na bandeja do sistema. */
export function ensureForegroundPushDisplaysInTray(event) {
  const notification = resolveForegroundPushNotification(event);
  if (notification && typeof notification.display === "function") {
    notification.display();
    return;
  }
  if (typeof event?.display === "function") {
    event.display();
  }
}

/** Trata push em foreground: bandeja + sheet in-app quando o registry permitir. */
export function presentForegroundPushNotification(event) {
  ensureForegroundPushDisplaysInTray(event);

  const notification = resolveForegroundPushNotification(event);
  const presentation = mapPushNotificationToPresentation(notification);

  if (!shouldOpenGenericForegroundPushSheet(presentation)) {
    return;
  }

  if (!presentation.title && !presentation.body) return;

  const closeSheet = () => useSheet.getState().closeSheet();
  const sheetButtons = resolvePushSheetButtons(presentation);
  const { openSheet } = useSheet.getState();

  openSheet(
    <ForegroundPushNotificationSheet
      notification={presentation}
      sheetButtons={sheetButtons}
      onMarkAsRead={closeSheet}
    />
  );
}
