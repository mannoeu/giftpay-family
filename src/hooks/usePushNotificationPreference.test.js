import { renderHook, act, waitFor } from "@testing-library/react-native";

import {
  checkPushNotificationPermissionStatus,
  setPushNotificationEnabled,
  isPushNotificationSupported,
} from "@/sdk/push-notification";
import { usePushNotificationPreference } from "./usePushNotificationPreference";

jest.mock("@/sdk/push-notification", () => ({
  checkPushNotificationPermissionStatus: jest.fn(),
  setPushNotificationEnabled: jest.fn(),
  isPushNotificationSupported: jest.fn(),
}));

const defaultStatus = {
  hasPermission: true,
  optedIn: true,
  canRequestPermission: false,
  isActive: true,
};

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  isPushNotificationSupported.mockReturnValue(true);
  checkPushNotificationPermissionStatus.mockResolvedValue(defaultStatus);
  setPushNotificationEnabled.mockResolvedValue({
    ...defaultStatus,
    openedSettings: false,
  });
});

afterEach(() => {
  jest.useFakeTimers();
});

it("carrega o status inicial de permissão", async () => {
  const { result } = await renderHook(() => usePushNotificationPreference());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.isActive).toBe(true);
  expect(result.current.isSupported).toBe(true);
});

it("expõe isActive false quando notificações estão desativadas", async () => {
  checkPushNotificationPermissionStatus.mockResolvedValue({
    ...defaultStatus,
    isActive: false,
    optedIn: false,
  });

  const { result } = await renderHook(() => usePushNotificationPreference());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.isActive).toBe(false);
});

it("chama setPushNotificationEnabled ao chamar setEnabled", async () => {
  const { result } = await renderHook(() => usePushNotificationPreference());

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.setEnabled(false);
  });

  expect(setPushNotificationEnabled).toHaveBeenCalledWith(false);
});

it("atualiza isActive após setEnabled(false)", async () => {
  setPushNotificationEnabled.mockResolvedValue({
    ...defaultStatus,
    isActive: false,
    optedIn: false,
    openedSettings: false,
  });

  const { result } = await renderHook(() => usePushNotificationPreference());

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  await act(async () => {
    await result.current.setEnabled(false);
  });

  expect(result.current.isActive).toBe(false);
});

it("isSupported false quando push não é suportado", async () => {
  isPushNotificationSupported.mockReturnValue(false);

  const { result } = await renderHook(() => usePushNotificationPreference());

  await waitFor(() => expect(result.current.isLoading).toBe(false));

  expect(result.current.isSupported).toBe(false);
});
