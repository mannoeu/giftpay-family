import Constants from "expo-constants";
import { Linking, NativeModules } from "react-native";

const APP_ID = Constants.expoConfig?.extra?.onesignal?.appId;

let initialized = false;
let cachedSdk = null;

const handlerRefs = {
  onClick: null,
  onForegroundWillDisplay: null,
  onPermissionChange: null,
};

/** iOS/Android: push é suportado nesta plataforma. */
export function isPushSupported() {
  return true;
}

/**
 * Carrega `react-native-onesignal` só quando o módulo nativo existe (evita crash no import).
 * Retorna `{ OneSignal, LogLevel }` ou `null`.
 */
function getOneSignalSdk() {
  if (NativeModules.OneSignal == null) {
    return null;
  }

  if (!cachedSdk) {
    cachedSdk = require("react-native-onesignal");
  }

  return cachedSdk;
}

/**
 * Inicializa o SDK OneSignal com o App ID do env (idempotente).
 * Não retorna valor.
 */
export function initProvider() {
  if (initialized || !APP_ID) {
    if (__DEV__ && !APP_ID) {
      console.warn(
        "[onesignal] init skipped: onesignal.appId ausente no app.json"
      );
    }
    return;
  }

  const sdk = getOneSignalSdk();
  if (!sdk) {
    if (__DEV__) {
      console.warn(
        "[onesignal] init skipped: módulo nativo indisponível (NativeModules.OneSignal)"
      );
    }
    return;
  }

  const { OneSignal, LogLevel } = sdk;

  if (__DEV__) {
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);
  }

  OneSignal.initialize(APP_ID);
  initialized = true;
  console.log("[onesignal] Loaded!");
}

/** Indica se o OneSignal já foi inicializado nesta sessão. */
export function isProviderInitialized() {
  return initialized;
}

/**
 * Lê permissão do SO, opt-in de subscription e se ainda dá para pedir permissão.
 * Retorna `{ hasPermission, optedIn, canRequestPermission }`.
 */
export async function getPermissionStatus() {
  if (!initialized) {
    return { hasPermission: false, optedIn: false, canRequestPermission: false };
  }

  const sdk = getOneSignalSdk();
  if (!sdk) {
    return { hasPermission: false, optedIn: false, canRequestPermission: false };
  }

  const { OneSignal } = sdk;

  const [hasPermission, optedIn, canRequestPermission] = await Promise.all([
    OneSignal.Notifications.getPermissionAsync(),
    OneSignal.User.pushSubscription.getOptedInAsync(),
    OneSignal.Notifications.canRequestPermission(),
  ]);

  return { hasPermission, optedIn, canRequestPermission };
}

/** Faz opt-in da push subscription no OneSignal. */
export function providerOptIn() {
  if (!initialized) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.pushSubscription.optIn();
}

/** Faz opt-out da push subscription no OneSignal. */
export function providerOptOut() {
  if (!initialized) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.pushSubscription.optOut();
}

/**
 * Exibe o diálogo nativo de permissão (ou fallback para Configurações).
 * Retorna `true` se concedida.
 */
export async function requestPermission({ fallbackToSettings = false } = {}) {
  if (!initialized) return false;

  const sdk = getOneSignalSdk();
  if (!sdk) return false;

  const { OneSignal } = sdk;

  const canRequest = await OneSignal.Notifications.canRequestPermission();
  const shouldFallback = fallbackToSettings || !canRequest;

  return OneSignal.Notifications.requestPermission(shouldFallback);
}

/** Chama `OneSignal.login` com o id do usuário. */
export function providerLogin(externalUserId) {
  if (!initialized || !externalUserId) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.login(String(externalUserId));
}

/** Chama `OneSignal.logout`. */
export function providerLogout() {
  if (!initialized) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.logout();
}

/** Associa um email Subscription ao usuário atual no OneSignal. */
export function providerAddEmail(email) {
  if (!initialized || !email) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.addEmail(String(email));
}

/** Remove o email Subscription do usuário atual no OneSignal. */
export function providerRemoveEmail(email) {
  if (!initialized || !email) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.removeEmail(String(email));
}

/** Envia tags de segmentação ao OneSignal. */
export function providerAddTags(tags) {
  if (!initialized || !tags) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.addTags(tags);
}

/** Remove uma tag no OneSignal. */
export function providerRemoveTag(name) {
  if (!initialized || !name) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  sdk.OneSignal.User.removeTag(name);
}

/** Remove várias tags no OneSignal. */
export function providerRemoveTags(names) {
  if (!initialized || !names?.length) return;
  const sdk = getOneSignalSdk();
  if (!sdk) return;
  names.forEach((name) => sdk.OneSignal.User.removeTag(name));
}

/**
 * Registra listeners OneSignal (click, foregroundWillDisplay, permissionChange).
 * Remove listeners anteriores antes; não retorna valor.
 */
export function registerProviderHandlers(handlers = {}) {
  unregisterProviderHandlers();

  if (!initialized) return;

  const sdk = getOneSignalSdk();
  if (!sdk) return;

  const { OneSignal } = sdk;

  const listening = [];

  if (handlers.onClick) {
    handlerRefs.onClick = handlers.onClick;
    OneSignal.Notifications.addEventListener("click", handlerRefs.onClick);
    listening.push("click");
  }

  if (handlers.onForegroundWillDisplay) {
    handlerRefs.onForegroundWillDisplay = handlers.onForegroundWillDisplay;
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handlerRefs.onForegroundWillDisplay
    );
    listening.push("foregroundWillDisplay");
  }

  if (handlers.onPermissionChange) {
    handlerRefs.onPermissionChange = handlers.onPermissionChange;
    OneSignal.Notifications.addEventListener(
      "permissionChange",
      handlerRefs.onPermissionChange
    );
    listening.push("permissionChange");
  }

  if (listening.length) {
    console.log("[onesignal] listen notifications — ", listening.join(", "));
  }
}

/**
 * Remove todos os listeners registrados por `registerProviderHandlers`.
 * Não retorna valor.
 */
export function unregisterProviderHandlers() {
  if (!initialized) return;

  const sdk = getOneSignalSdk();
  if (!sdk) return;

  const { OneSignal } = sdk;

  if (handlerRefs.onClick) {
    OneSignal.Notifications.removeEventListener("click", handlerRefs.onClick);
    handlerRefs.onClick = null;
  }

  if (handlerRefs.onForegroundWillDisplay) {
    OneSignal.Notifications.removeEventListener(
      "foregroundWillDisplay",
      handlerRefs.onForegroundWillDisplay
    );
    handlerRefs.onForegroundWillDisplay = null;
  }

  if (handlerRefs.onPermissionChange) {
    OneSignal.Notifications.removeEventListener(
      "permissionChange",
      handlerRefs.onPermissionChange
    );
    handlerRefs.onPermissionChange = null;
  }
}

/** Abre as configurações do app no SO. Retorna `{ opened, guidance }`. */
export async function openSettings() {
  await Linking.openSettings();
  return { opened: true, guidance: null };
}
