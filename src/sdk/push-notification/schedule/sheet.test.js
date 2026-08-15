jest.mock("@/store/auth", () => ({
  useAuthStore: {
    getState: jest.fn(() => ({ token: { access_token: "tok" } })),
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

import React from "react";
import { useAuthStore } from "@/store/auth";
import { useSheet } from "@/store/sheet";
import {
  scheduleOpenSheet,
  flushPendingOpenSheet,
  hasPendingOpenSheet,
  clearPendingOpenSheet,
} from "@/sdk/push-notification/schedule/sheet";

describe("push notification schedule/sheet", () => {
  const openSheet = jest.fn();

  beforeEach(() => {
    clearPendingOpenSheet();
    jest.clearAllMocks();
    openSheet.mockReturnValue(true);
    useSheet.getState.mockReturnValue({ openSheet, closeSheet: jest.fn() });
    useAuthStore.getState.mockReturnValue({ token: { access_token: "tok" } });
  });

  it("logado abre o sheet na hora", () => {
    const content = React.createElement("div", { id: "sheet-a" });
    scheduleOpenSheet(content);

    expect(openSheet).toHaveBeenCalledTimes(1);
    expect(openSheet).toHaveBeenCalledWith(content);
    expect(hasPendingOpenSheet()).toBe(false);
  });

  it("openSheet bloqueado mantém a pendência para flush posterior", () => {
    openSheet.mockReturnValue(false);
    const content = React.createElement("div", { id: "sheet-locked" });

    scheduleOpenSheet(content);

    expect(openSheet).toHaveBeenCalledWith(content);
    expect(hasPendingOpenSheet()).toBe(true);
  });

  it("flush sem pendência ou deslogado é no-op", () => {
    expect(flushPendingOpenSheet()).toBe(false);

    useAuthStore.getState.mockReturnValue({ token: null });
    scheduleOpenSheet(React.createElement("div"));
    expect(flushPendingOpenSheet()).toBe(false);
    expect(openSheet).not.toHaveBeenCalled();
  });
});
