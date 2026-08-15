import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

import { contactEmail } from "@/sdk/constants";
import { ToastSuccess } from "@/sdk/toast";
import { openSupportEmail } from "@/sdk/support";

jest.mock("expo-linking", () => ({
  openURL: jest.fn(() => Promise.resolve()),
}));

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("@/sdk/toast", () => ({
  ToastSuccess: jest.fn(),
}));

describe("openSupportEmail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("copia o e-mail, avisa no toast e só então abre o mailto", async () => {
    await openSupportEmail();

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(contactEmail);
    expect(ToastSuccess).toHaveBeenCalledWith(
      "O e-mail foi copiado para a área de transferência.",
    );
    expect(Linking.openURL).toHaveBeenCalledWith(`mailto:${contactEmail}`);
    expect(ToastSuccess.mock.invocationCallOrder[0]).toBeLessThan(
      Linking.openURL.mock.invocationCallOrder[0],
    );
  });

  it("copia o e-mail mesmo se o mailto falhar", async () => {
    Linking.openURL.mockRejectedValueOnce(new Error("no mail app"));

    await openSupportEmail();

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith(contactEmail);
    expect(ToastSuccess).toHaveBeenCalledWith(
      "O e-mail foi copiado para a área de transferência.",
    );
  });
});
