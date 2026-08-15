import { resolvePushNotificationToggleAction } from "@/sdk/push-notification/preference/toggle";
import { waitForPushNotificationActive } from "@/sdk/push-notification/preference/waitForActive";
import { forcePushSubscriptionRegistration } from "@/sdk/push-notification/preference/registerSubscription";
import {
  hasAttemptedNativePermissionPromptThisSession,
  markNativePermissionPromptAttemptedThisSession,
  resolveNativePermissionGate,
} from "@/sdk/push-notification/permission/nativePromptGate";

let initialized = false;
let syncedTags = {};
let syncedEmail = null;
let registeredHandlers = null;
let pushAdapter = null;

/**
 * Carrega o adapter de push sob demanda (Metro resolve `.native`).
 */
function getPushAdapter() {
  if (!pushAdapter) {
    pushAdapter = require("@/sdk/push-notification/adapter");
  }
  return pushAdapter;
}

/** Indica se push está disponível nesta plataforma. */
export function isPushNotificationSupported() {
  return !!getPushAdapter().isPushSupported();
}

function computeTagDiff(previousTags, nextTags) {
  const toAdd = {};
  const toRemove = [];

  Object.entries(nextTags).forEach(([key, value]) => {
    if (previousTags[key] !== value) {
      toAdd[key] = value;
    }
  });

  Object.keys(previousTags).forEach((key) => {
    if (!(key in nextTags)) {
      toRemove.push(key);
    }
  });

  return { toAdd, toRemove };
}

function flushTagsToProvider() {
  if (
    !isPushNotificationSupported() ||
    !initialized ||
    !Object.keys(syncedTags).length
  ) {
    return;
  }
  getPushAdapter().providerAddTags(syncedTags);
}

function applyTagDiff(partialTags) {
  const nextTags = { ...syncedTags, ...partialTags };
  const { toAdd, toRemove } = computeTagDiff(syncedTags, nextTags);

  syncedTags = nextTags;

  if (!isPushNotificationSupported() || !initialized) return;

  if (Object.keys(toAdd).length) {
    getPushAdapter().providerAddTags(toAdd);
  }
  if (toRemove.length) {
    getPushAdapter().providerRemoveTags(toRemove);
  }
}

/**
 * Inicializa o provedor de push (idempotente).
 * Reaplica handlers e tags já registrados.
 */
export function initPushNotificationService() {
  if (!isPushNotificationSupported() || initialized) return;

  getPushAdapter().initProvider();
  initialized = getPushAdapter().isProviderInitialized();

  if (!initialized) return;

  reapplyRegisteredHandlers();
  flushTagsToProvider();
}

function reapplyRegisteredHandlers() {
  if (
    !registeredHandlers ||
    !isPushNotificationSupported() ||
    !initialized
  ) {
    return;
  }

  getPushAdapter().registerProviderHandlers(registeredHandlers);
}

function ensurePushNotificationServiceInitialized() {
  if (!isPushNotificationSupported()) return false;
  if (!initialized) {
    initPushNotificationService();
  }
  return initialized;
}

/**
 * Consulta permissão e opt-in no provedor.
 * Retorna `{ hasPermission, optedIn, canRequestPermission, isActive }`.
 */
export async function checkPushNotificationPermissionStatus() {
  if (!isPushNotificationSupported()) {
    return { hasPermission: false, optedIn: false, canRequestPermission: false, isActive: false };
  }

  if (!ensurePushNotificationServiceInitialized()) {
    return { hasPermission: false, optedIn: false, canRequestPermission: false, isActive: false };
  }

  const { hasPermission, optedIn, canRequestPermission } =
    await getPushAdapter().getPermissionStatus();

  return { hasPermission, optedIn, canRequestPermission, isActive: hasPermission && optedIn };
}

/**
 * Pede permissão nativa ou abre Configurações quando o dialog não está mais disponível.
 * Retorna `{ granted, openedSettings }`.
 */
export async function requestPushNotificationPermission({
  fallbackToSettings = false,
} = {}) {
  if (
    !isPushNotificationSupported() ||
    !ensurePushNotificationServiceInitialized()
  ) {
    return { granted: false, openedSettings: false };
  }

  const current = await getPushAdapter().getPermissionStatus();
  const gate = resolveNativePermissionGate({
    hasPermission: current.hasPermission,
    canRequestPermission: current.canRequestPermission,
    alreadyAttempted: hasAttemptedNativePermissionPromptThisSession(),
  });

  if (gate === "granted") {
    getPushAdapter().providerOptIn();
    const status = await waitForPushNotificationActive({
      getStatus: checkPushNotificationPermissionStatus,
    });
    return { granted: status.isActive, openedSettings: false };
  }

  if (gate === "openSettings") {
    markNativePermissionPromptAttemptedThisSession();
    const { opened } = await getPushAdapter().openSettings();
    return { granted: false, openedSettings: !!opened };
  }

  markNativePermissionPromptAttemptedThisSession();
  const granted = await getPushAdapter().requestPermission({
    fallbackToSettings: false,
  });

  if (granted) {
    const adapter = getPushAdapter();
    forcePushSubscriptionRegistration({
      providerOptOut: () => adapter.providerOptOut(),
      providerOptIn: () => adapter.providerOptIn(),
    });
    const status = await waitForPushNotificationActive({
      getStatus: checkPushNotificationPermissionStatus,
    });
    return { granted: status.isActive, openedSettings: false };
  }

  const afterPrompt = await getPushAdapter().getPermissionStatus();
  if (!afterPrompt.canRequestPermission || fallbackToSettings) {
    const { opened } = await getPushAdapter().openSettings();
    return { granted: false, openedSettings: !!opened };
  }

  return { granted: false, openedSettings: false };
}

/** Abre configurações do app. Retorna `{ opened, guidance }`. */
export async function openPushNotificationSettings() {
  return getPushAdapter().openSettings();
}

/**
 * Ativa ou desativa notificações push (opt-in/opt-out).
 * Retorna status atual + `openedSettings`.
 */
export async function setPushNotificationEnabled(enabled) {
  const inactive = {
    hasPermission: false,
    optedIn: false,
    canRequestPermission: false,
    isActive: false,
    openedSettings: false,
  };

  if (
    !isPushNotificationSupported() ||
    !ensurePushNotificationServiceInitialized()
  ) {
    return inactive;
  }

  const current = await getPushAdapter().getPermissionStatus();
  const action = resolvePushNotificationToggleAction({
    enabled: !!enabled,
    hasPermission: current.hasPermission,
    optedIn: current.optedIn,
    canRequestPermission: current.canRequestPermission,
    nativePromptAlreadyAttempted: hasAttemptedNativePermissionPromptThisSession(),
  });

  if (action === "openSettings") {
    markNativePermissionPromptAttemptedThisSession();
    const { opened } = await getPushAdapter().openSettings();
    const status = await checkPushNotificationPermissionStatus();
    return { ...status, openedSettings: !!opened };
  }

  if (action === "optIn") {
    if (!current.hasPermission) {
      markNativePermissionPromptAttemptedThisSession();
      const granted = await getPushAdapter().requestPermission({ fallbackToSettings: false });
      const afterPrompt = await getPushAdapter().getPermissionStatus();

      if (!granted) {
        if (!afterPrompt.canRequestPermission) {
          const { opened } = await getPushAdapter().openSettings();
          const status = await checkPushNotificationPermissionStatus();
          return { ...status, openedSettings: !!opened };
        }
        const status = await checkPushNotificationPermissionStatus();
        return { ...status, openedSettings: false };
      }

      const adapter = getPushAdapter();
      forcePushSubscriptionRegistration({
        providerOptOut: () => adapter.providerOptOut(),
        providerOptIn: () => adapter.providerOptIn(),
      });
    } else {
      getPushAdapter().providerOptIn();
    }

    const status = await waitForPushNotificationActive({
      getStatus: checkPushNotificationPermissionStatus,
    });
    return { ...status, openedSettings: false };
  }

  if (action === "optOut") {
    getPushAdapter().providerOptOut();
  }

  const status = await checkPushNotificationPermissionStatus();
  return { ...status, openedSettings: false };
}

/** Associa o usuário logado ao provedor (external user id). */
export function pushNotificationLogin(externalUserId) {
  if (!externalUserId) return;
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().providerLogin(externalUserId);
    reapplyRegisteredHandlers();
  }
}

/**
 * Associa o email do usuário ao provedor.
 * Guarda o valor para remover no logout.
 */
export function addEmail(email) {
  if (!email) return;
  const normalized = String(email).trim();
  if (!normalized) return;
  syncedEmail = normalized;
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().providerAddEmail(normalized);
  }
}

/**
 * Remove o email Subscription no provedor.
 * Sem argumento, remove o email sincronizado localmente.
 */
export function removeEmail(email) {
  const target = email ? String(email).trim() : syncedEmail;
  if (!target) return;
  if (syncedEmail === target) {
    syncedEmail = null;
  }
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().providerRemoveEmail(target);
  }
}

/** Remove todas as tags locais e no provedor. */
export function clearTags() {
  const keys = Object.keys(syncedTags);
  syncedTags = {};
  if (!isPushNotificationSupported() || !initialized || !keys.length) return;
  getPushAdapter().providerRemoveTags(keys);
}

/** Desassocia o usuário no provedor e limpa email/tags (logout). */
export function pushNotificationLogout() {
  removeEmail();
  clearTags();
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().providerLogout();
    reapplyRegisteredHandlers();
  }
}

/**
 * Mescla tags no estado local e envia diff ao provedor.
 * Não retorna valor; ignora objeto vazio ou inválido.
 */
export function addTags(tags) {
  if (!tags || typeof tags !== "object") return;

  const normalized = Object.entries(tags).reduce((acc, [key, value]) => {
    if (value == null || value === "") return acc;
    acc[key] = String(value);
    return acc;
  }, {});

  if (!Object.keys(normalized).length) return;
  applyTagDiff(normalized);
}

/** Remove uma tag pelo nome (local + provedor). */
export function removeTag(name) {
  if (!name || !(name in syncedTags)) return;
  const nextTags = { ...syncedTags };
  delete nextTags[name];
  syncedTags = nextTags;
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().providerRemoveTags([name]);
  }
}

/**
 * Registra callbacks de click, foreground e mudança de permissão no provedor.
 * Guarda referência para reaplicar após `init`.
 */
export function registerPushNotificationHandlers(handlers = {}) {
  registeredHandlers = handlers;
  if (!isPushNotificationSupported()) return;
  if (ensurePushNotificationServiceInitialized()) {
    getPushAdapter().registerProviderHandlers(handlers);
  }
}

/** Remove listeners do provedor e limpa handlers em memória. */
export function unregisterPushNotificationHandlers() {
  registeredHandlers = null;
  if (isPushNotificationSupported() && initialized) {
    getPushAdapter().unregisterProviderHandlers();
  }
}
