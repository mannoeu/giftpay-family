import { Formatter } from "@/sdk/formatter";

describe("Formatter.cpf", () => {
  it("aplica a máscara 000.000.000-00", () => {
    expect(Formatter.cpf("12345678909")).toBe("123.456.789-09");
  });
});

describe("Formatter.getDate", () => {
  it("decompõe a data local em partes e strings de exibição", () => {
    const date = new Date(2026, 3, 20, 13, 30);

    expect(Formatter.getDate(date)).toEqual({
      day: "20",
      month: "04",
      year: 2026,
      hours: "13",
      minutes: "30",
      displayDate: "20/04/2026",
      displayHour: "13:30",
      displayDateAndTime: "20/04/2026 às 13:30",
    });
  });
});

describe("Formatter.getDateAndTimeString", () => {
  it("formata como dd/MM/yyyy às HH:mm", () => {
    const date = new Date(2026, 3, 20, 13, 30);

    expect(Formatter.getDateAndTimeString(date)).toBe("20/04/2026 às 13:30");
  });
});
