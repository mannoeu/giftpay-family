import {
  AVATAR_COLORS,
  appendDependentToList,
  birthDateToIso,
  buildCreateDependentPayload,
} from "@/sdk/dependent";

describe("birthDateToIso", () => {
  it("converte DD/MM/YYYY em YYYY-MM-DD", () => {
    expect(birthDateToIso("23/05/2014")).toBe("2014-05-23");
  });
});

describe("buildCreateDependentPayload", () => {
  it("trim do nome e converte a data para ISO", () => {
    expect(
      buildCreateDependentPayload({
        name: " José ",
        birthDate: "23/05/2014",
        color: "#557FEA",
      }),
    ).toEqual({
      name: "José",
      birthDate: "2014-05-23",
      color: "#557FEA",
    });
  });
});
