jest.mock("expo-router", () => ({
  router: {
    navigate: jest.fn(),
    replace: jest.fn(),
  },
}));

jest.mock("@/store/auth", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ token: null })),
  },
}));

jest.mock("@/store/sheet", () => ({
  useSheet: {
    getState: jest.fn(() => ({
      openSheet: jest.fn(),
      closeSheet: jest.fn(),
    })),
  },
}));

import { router } from "expo-router";
import { useAuthStore } from "@/store/auth";
import { useSheet } from "@/store/sheet";
import {
  clearPendingOpenSheet,
  clearPendingPushNavigation,
  hasPendingOpenSheet,
  peekPendingPushNavigationHref,
  scheduleOpenSheet,
  schedulePushNavigation,
} from "@/sdk/push-notification/schedule";
import { flushPendingPushWhenReady } from "@/sdk/push-notification/schedule/flush";

const PENDING_HREF = "/(private)/home";
const SHEET_CONTENT = "gift-sheet";
const openSheet = jest.fn();

function schedulePushWhileLoggedOut() {
  useAuthStore.getState.mockReturnValue({ token: null });
  schedulePushNavigation(PENDING_HREF);
  scheduleOpenSheet(SHEET_CONTENT);
}

describe("flushPendingPushWhenReady", () => {
  beforeEach(() => {
    clearPendingPushNavigation();
    clearPendingOpenSheet();
    jest.clearAllMocks();
    openSheet.mockReset();
    useSheet.getState.mockReturnValue({ openSheet, closeSheet: jest.fn() });
    useAuthStore.getState.mockReturnValue({ token: null });
  });

  it("após login ainda no grupo public, não navega e deixa o href pro auth guard", () => {
    schedulePushWhileLoggedOut();
    useAuthStore.getState.mockReturnValue({
      token: { access_token: "tok" },
    });

    flushPendingPushWhenReady({
      navigationReady: true,
      isAuthenticated: true,
      isFirstAccess: false,
      segments: ["(public)", "login"],
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(peekPendingPushNavigationHref()).toBe(PENDING_HREF);
    expect(openSheet).toHaveBeenCalledWith(SHEET_CONTENT);
  });

  it("já autenticado no grupo private, flusha a navegação pendente", () => {
    schedulePushWhileLoggedOut();
    useAuthStore.getState.mockReturnValue({
      token: { access_token: "tok" },
    });

    flushPendingPushWhenReady({
      navigationReady: true,
      isAuthenticated: true,
      isFirstAccess: false,
      segments: ["(private)", "home"],
    });

    expect(router.navigate).toHaveBeenCalledWith(PENDING_HREF);
    expect(peekPendingPushNavigationHref()).toBeNull();
  });

  it("após criar senha ainda na tela de primeiro acesso, deixa o href pro auth guard", () => {
    schedulePushWhileLoggedOut();
    useAuthStore.getState.mockReturnValue({
      token: { access_token: "tok" },
    });

    flushPendingPushWhenReady({
      navigationReady: true,
      isAuthenticated: true,
      isFirstAccess: false,
      segments: ["first-access"],
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(peekPendingPushNavigationHref()).toBe(PENDING_HREF);
    expect(openSheet).toHaveBeenCalledWith(SHEET_CONTENT);
  });

  it("segments vazios não flusham — navigator ainda está assentando", () => {
    schedulePushWhileLoggedOut();
    useAuthStore.getState.mockReturnValue({
      token: { access_token: "tok" },
    });

    flushPendingPushWhenReady({
      navigationReady: true,
      isAuthenticated: true,
      isFirstAccess: false,
      segments: [],
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(peekPendingPushNavigationHref()).toBe(PENDING_HREF);
    expect(hasPendingOpenSheet()).toBe(true);
  });

  it("em primeiro acesso não flusha navegação nem sheet", () => {
    schedulePushWhileLoggedOut();
    useAuthStore.getState.mockReturnValue({
      token: { access_token: "tok" },
    });

    flushPendingPushWhenReady({
      navigationReady: true,
      isAuthenticated: true,
      isFirstAccess: true,
      segments: ["first-access"],
    });

    expect(router.navigate).not.toHaveBeenCalled();
    expect(peekPendingPushNavigationHref()).toBe(PENDING_HREF);
    expect(hasPendingOpenSheet()).toBe(true);
  });
});
