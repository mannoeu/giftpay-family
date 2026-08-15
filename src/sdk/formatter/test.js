import { Formatter } from "@/sdk/formatter";

describe("Formatter.cpf", () => {
  it("aplica a máscara 000.000.000-00", () => {
    expect(Formatter.cpf("12345678909")).toBe("123.456.789-09");
  });
});
