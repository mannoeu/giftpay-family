import { Formatter } from "@/sdk/formatter";

import {
  TransactionVariant,
  formatTransactionValue,
  getTransactionValueColorToken,
  getTransactionVariant,
  resolveTransactionVariant,
  serializeLastActivity,
} from "./index";

describe("formatTransactionValue", () => {
  it("prefixa + no valor de entrada", () => {
    expect(formatTransactionValue(50, TransactionVariant.in)).toBe(
      `+${Formatter.currency(50, { forcePositive: true })}`,
    );
  });

  it("prefixa - no valor de saída", () => {
    expect(formatTransactionValue(15, TransactionVariant.out)).toBe(
      `-${Formatter.currency(15, { forcePositive: true })}`,
    );
  });

  it("prefixa - no valor de compra negada", () => {
    expect(formatTransactionValue(15, TransactionVariant.denied)).toBe(
      `-${Formatter.currency(15, { forcePositive: true })}`,
    );
  });

  it("usa o valor absoluto quando a entrada já é negativa", () => {
    expect(formatTransactionValue(-15, TransactionVariant.out)).toBe(
      `-${Formatter.currency(15, { forcePositive: true })}`,
    );
  });

  it("não prefixa sinal na variant genérica", () => {
    expect(formatTransactionValue(15, TransactionVariant.unknown)).toBe(
      Formatter.currency(15, { forcePositive: true }),
    );
  });
});

describe("getTransactionValueColorToken", () => {
  it("usa teal para entrada", () => {
    expect(getTransactionValueColorToken(TransactionVariant.in)).toBe("teal");
  });

  it("usa danger para compra negada", () => {
    expect(getTransactionValueColorToken(TransactionVariant.denied)).toBe(
      "danger",
    );
  });

  it("usa charcoal para saída", () => {
    expect(getTransactionValueColorToken(TransactionVariant.out)).toBe(
      "charcoal",
    );
  });

  it("usa charcoal na variant genérica", () => {
    expect(getTransactionValueColorToken(TransactionVariant.unknown)).toBe(
      "charcoal",
    );
  });
});

describe("getTransactionVariant", () => {
  it("mapeia saída aprovada", () => {
    expect(
      getTransactionVariant({ direction: "out", status: "approved" }),
    ).toBe(TransactionVariant.out);
  });

  it("mapeia entrada aprovada", () => {
    expect(
      getTransactionVariant({ direction: "in", status: "approved" }),
    ).toBe(TransactionVariant.in);
  });

  it("mapeia compra negada mesmo quando é saída", () => {
    expect(
      getTransactionVariant({ direction: "out", status: "denied" }),
    ).toBe(TransactionVariant.denied);
  });

  it("usa a variant genérica quando direction e status não mapeiam", () => {
    expect(getTransactionVariant({})).toBe(TransactionVariant.unknown);
  });
});

describe("resolveTransactionVariant", () => {
  it("devolve a própria variant quando ela é conhecida", () => {
    expect(resolveTransactionVariant(TransactionVariant.in)).toBe(
      TransactionVariant.in,
    );
  });

  it("devolve a variant genérica quando não é enviada", () => {
    expect(resolveTransactionVariant()).toBe(TransactionVariant.unknown);
  });

  it("devolve a variant genérica quando não está no mapa", () => {
    expect(resolveTransactionVariant("entrada")).toBe(
      TransactionVariant.unknown,
    );
  });
});

describe("serializeLastActivity", () => {
  it("normaliza o payload da API para o shape do Transaction sem formatar a data", () => {
    expect(
      serializeLastActivity({
        id: 1,
        direction: "out",
        status: "approved",
        title: "Compra aprovada",
        subtitle: "Em Livraria XPTO",
        amount: "15.00",
        created_at: "2026-04-20T16:30:00.000Z",
        parent: { id: 1, name: "João", color: "#557FEA" },
      }),
    ).toEqual({
      id: 1,
      variant: TransactionVariant.out,
      title: "Compra aprovada",
      subtitle: "Em Livraria XPTO",
      created_at: "2026-04-20T16:30:00.000Z",
      value: 15,
      letter: "J",
      color: "#557FEA",
    });
  });

  it("usa a variant genérica quando a API não traz direction/status mapeáveis", () => {
    expect(
      serializeLastActivity({
        id: 9,
        title: "Ajuste",
        amount: "0.00",
        created_at: "2026-04-20T16:30:00.000Z",
      }),
    ).toMatchObject({
      variant: TransactionVariant.unknown,
    });
  });
});
