import * as Clipboard from "expo-clipboard";

import { WalletEnum } from "@/sdk/wallet";
import { ToastSuccess } from "@/sdk/toast";

import {
  DepositStatus,
  PIX_COPIED_MESSAGE,
  copyPixCode,
  getDepositColorToken,
  getDepositCreatedLabel,
  getDepositDestinationLabel,
  getDepositPaidLabel,
  getDepositStatusLabel,
  resolveDepositStatus,
  serializeDeposit,
} from "./index";

jest.mock("expo-clipboard", () => ({
  setStringAsync: jest.fn(() => Promise.resolve(true)),
}));

jest.mock("@/sdk/toast", () => ({
  ToastSuccess: jest.fn(),
}));

const pendingItem = {
  id: 1,
  status: "pending",
  amount: "50.00",
  wallet: WalletEnum.meal,
  created_at: "2026-04-20T16:00:00.000Z",
  paid_at: null,
  pix_code: "00020126MOCKPIX",
  parent: { id: 1, name: "João", color: "#557FEA" },
};

const paidItem = {
  id: 2,
  status: "paid",
  amount: "50.00",
  wallet: WalletEnum.allowance,
  created_at: "2026-04-20T16:00:00.000Z",
  paid_at: "2026-04-20T16:02:00.000Z",
  pix_code: null,
  parent: { id: 2, name: "Maria", color: "#C06990" },
};

describe("resolveDepositStatus", () => {
  it("reconhece pending e paid", () => {
    expect(resolveDepositStatus(DepositStatus.pending)).toBe(
      DepositStatus.pending,
    );
    expect(resolveDepositStatus(DepositStatus.paid)).toBe(DepositStatus.paid);
  });

  it("cai em pending quando o status é desconhecido", () => {
    expect(resolveDepositStatus("foo")).toBe(DepositStatus.pending);
    expect(resolveDepositStatus()).toBe(DepositStatus.pending);
  });
});

describe("getDepositStatusLabel", () => {
  it("rotula pending e paid em pt-BR", () => {
    expect(getDepositStatusLabel(DepositStatus.pending)).toBe("Pendente");
    expect(getDepositStatusLabel(DepositStatus.paid)).toBe("Pago");
  });

  it("rotula status desconhecido como Pendente", () => {
    expect(getDepositStatusLabel("foo")).toBe("Pendente");
  });
});

describe("getDepositColorToken", () => {
  it("usa gold no pendente e teal no pago", () => {
    expect(getDepositColorToken(DepositStatus.pending)).toBe("gold");
    expect(getDepositColorToken(DepositStatus.paid)).toBe("teal");
  });

  it("usa gold quando o status é desconhecido", () => {
    expect(getDepositColorToken("foo")).toBe("gold");
  });
});

describe("serializeDeposit", () => {
  it("serializa depósito pendente da carteira Lanche", () => {
    expect(serializeDeposit(pendingItem)).toEqual({
      id: 1,
      status: DepositStatus.pending,
      title: "Pendente",
      subtitle: "Carteira Lanche",
      created_at: "2026-04-20T16:00:00.000Z",
      paid_at: null,
      pix_code: "00020126MOCKPIX",
      value: 50,
      letter: "J",
      color: "#557FEA",
      parentName: "João",
      walletName: "Lanche",
      titleColorToken: "gold",
      valueColorToken: "gold",
    });
  });

  it("serializa depósito pago da carteira Mesada", () => {
    expect(serializeDeposit(paidItem)).toEqual({
      id: 2,
      status: DepositStatus.paid,
      title: "Pago",
      subtitle: "Carteira Mesada",
      created_at: "2026-04-20T16:00:00.000Z",
      paid_at: "2026-04-20T16:02:00.000Z",
      pix_code: null,
      value: 50,
      letter: "M",
      color: "#C06990",
      parentName: "Maria",
      walletName: "Mesada",
      titleColorToken: "teal",
      valueColorToken: "teal",
    });
  });

  it("não lança quando o status é desconhecido", () => {
    expect(
      serializeDeposit({
        ...pendingItem,
        status: "foo",
      }),
    ).toMatchObject({
      status: DepositStatus.pending,
      title: "Pendente",
      titleColorToken: "gold",
    });
  });
});

describe("getDepositDestinationLabel", () => {
  it("monta o destino da carteira", () => {
    expect(
      getDepositDestinationLabel({
        walletName: "Lanche",
        parentName: "João",
      }),
    ).toBe("Para a carteira Lanche de João");
  });
});

describe("getDepositCreatedLabel", () => {
  it("prefixa Criado em na data formatada", () => {
    expect(getDepositCreatedLabel("2026-04-20T16:00:00.000Z")).toMatch(
      /^Criado em \d{2}\/\d{2}\/2026 às \d{2}:\d{2}$/,
    );
  });
});

describe("getDepositPaidLabel", () => {
  it("prefixa Pago em na data formatada", () => {
    expect(getDepositPaidLabel("2026-04-20T16:02:00.000Z")).toMatch(
      /^Pago em \d{2}\/\d{2}\/2026 às \d{2}:\d{2}$/,
    );
  });
});

describe("copyPixCode", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("copia o código e avisa no toast", async () => {
    await copyPixCode("00020126MOCKPIX");

    expect(Clipboard.setStringAsync).toHaveBeenCalledWith("00020126MOCKPIX");
    expect(ToastSuccess).toHaveBeenCalledWith(PIX_COPIED_MESSAGE);
  });

  it("não copia quando o código é vazio ou nulo", async () => {
    await copyPixCode(null);
    await copyPixCode("");
    await copyPixCode("   ");

    expect(Clipboard.setStringAsync).not.toHaveBeenCalled();
    expect(ToastSuccess).not.toHaveBeenCalled();
  });
});
