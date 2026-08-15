import { renderHook } from "@testing-library/react-native";

import {
  checkPushNotificationPermissionStatus,
  shouldOfferPermissionPromptThisSession,
  markPermissionPromptOfferedThisSession,
  isPushNotificationSupported,
} from "@/sdk/push-notification";
import { useSheet } from "@/store/sheet";
import { usePushNotificationPermissionPrompt } from "./usePushNotificationPermissionPrompt";

jest.mock("@/sdk/push-notification", () => ({
  checkPushNotificationPermissionStatus: jest.fn(),
  shouldOfferPermissionPromptThisSession: jest.fn(),
  markPermissionPromptOfferedThisSession: jest.fn(),
  isPushNotificationSupported: jest.fn(),
}));

jest.mock("@/store/sheet", () => ({
  useSheet: jest.fn(),
}));

jest.mock("expo-router", () => ({
  useFocusEffect: jest.fn((cb) => {
    cb();
  }),
}));

jest.mock("@/components/sheets/permissionPromptSheet", () => ({
  PermissionPromptSheet: () => null,
}));

const openSheetMock = jest.fn();

beforeEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
  isPushNotificationSupported.mockReturnValue(true);
  checkPushNotificationPermissionStatus.mockResolvedValue({
    hasPermission: false,
    optedIn: false,
    isActive: false,
    canRequestPermission: true,
  });
  shouldOfferPermissionPromptThisSession.mockReturnValue(true);
  markPermissionPromptOfferedThisSession.mockReturnValue(undefined);
  useSheet.mockReturnValue(openSheetMock);
});

afterEach(() => {
  jest.useFakeTimers();
});

it("abre o sheet quando push não está ativo e é a 1ª vez na sessão", async () => {
  await renderHook(() => usePushNotificationPermissionPrompt());
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(checkPushNotificationPermissionStatus).toHaveBeenCalled();
  expect(shouldOfferPermissionPromptThisSession).toHaveBeenCalled();
  expect(openSheetMock).toHaveBeenCalled();
  expect(markPermissionPromptOfferedThisSession).toHaveBeenCalled();
});

it("não abre o sheet quando push está ativo", async () => {
  checkPushNotificationPermissionStatus.mockResolvedValue({
    hasPermission: true,
    optedIn: true,
    isActive: true,
    canRequestPermission: false,
  });
  shouldOfferPermissionPromptThisSession.mockReturnValue(false);

  await renderHook(() => usePushNotificationPermissionPrompt());
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(openSheetMock).not.toHaveBeenCalled();
});

it("não abre o sheet quando já foi oferecido nesta sessão", async () => {
  shouldOfferPermissionPromptThisSession.mockReturnValue(false);

  await renderHook(() => usePushNotificationPermissionPrompt());
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(openSheetMock).not.toHaveBeenCalled();
  expect(markPermissionPromptOfferedThisSession).not.toHaveBeenCalled();
});

it("não abre o sheet quando push não é suportado", async () => {
  isPushNotificationSupported.mockReturnValue(false);

  await renderHook(() => usePushNotificationPermissionPrompt());
  await new Promise((resolve) => setTimeout(resolve, 10));

  expect(openSheetMock).not.toHaveBeenCalled();
});
