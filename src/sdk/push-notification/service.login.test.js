jest.mock("@/sdk/push-notification/adapter", () => ({
  isPushSupported: jest.fn(() => true),
  initProvider: jest.fn(),
  isProviderInitialized: jest.fn(() => true),
  providerLogin: jest.fn(),
  providerLogout: jest.fn(),
  providerAddTags: jest.fn(),
  providerRemoveTags: jest.fn(),
  providerAddEmail: jest.fn(),
  providerRemoveEmail: jest.fn(),
  registerProviderHandlers: jest.fn(),
  unregisterProviderHandlers: jest.fn(),
  getPermissionStatus: jest.fn(),
  requestPermission: jest.fn(),
  providerOptIn: jest.fn(),
  providerOptOut: jest.fn(),
  openSettings: jest.fn(),
}));

import {
  initPushNotificationService,
  pushNotificationLogin,
  pushNotificationLogout,
  registerPushNotificationHandlers,
} from "@/sdk/push-notification/service";
import * as adapter from "@/sdk/push-notification/adapter";

describe("push notification service — login/logout", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    adapter.isPushSupported.mockReturnValue(true);
    adapter.isProviderInitialized.mockReturnValue(true);
    initPushNotificationService();
  });

  it("login reaplica handlers já registrados", () => {
    const handlers = { onClick: jest.fn() };
    registerPushNotificationHandlers(handlers);
    jest.clearAllMocks();
    adapter.isPushSupported.mockReturnValue(true);

    pushNotificationLogin("user-uuid");

    expect(adapter.providerLogin).toHaveBeenCalledWith("user-uuid");
    expect(adapter.registerProviderHandlers).toHaveBeenCalledWith(handlers);
  });

  it("logout reaplica handlers já registrados", () => {
    const handlers = { onForegroundWillDisplay: jest.fn() };
    registerPushNotificationHandlers(handlers);
    jest.clearAllMocks();
    adapter.isPushSupported.mockReturnValue(true);

    pushNotificationLogout();

    expect(adapter.providerLogout).toHaveBeenCalled();
    expect(adapter.registerProviderHandlers).toHaveBeenCalledWith(handlers);
  });
});
