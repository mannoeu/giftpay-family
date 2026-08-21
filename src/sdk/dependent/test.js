import {
  AVATAR_COLORS,
  appendDependentToList,
  birthDateToIso,
  buildCreateDependentPayload,
} from "@/sdk/dependent";

describe("AVATAR_COLORS", () => {
  it("expõe as cinco cores do picker", () => {
    expect(AVATAR_COLORS).toEqual([
      "#7A64C8",
      "#C06990",
      "#56A263",
      "#557FEA",
      "#BEAC48",
    ]);
  });
});

describe("birthDateToIso", () => {
  it("converte DD/MM/YYYY em YYYY-MM-DD", () => {
    expect(birthDateToIso("23/05/2014")).toBe("2014-05-23");
  });
});

describe("buildCreateDependentPayload", () => {
  it("trim do nome e converte a data para ISO", () => {
    expect(
      buildCreateDependentPayload({
        name: "José",
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

describe("appendDependentToList", () => {
  it("acrescenta o dependente quando o id é novo", () => {
    const list = [{ id: 1, name: "João" }];
    const created = { id: 6, name: "José" };

    expect(appendDependentToList(list, created)).toEqual([
      { id: 1, name: "João" },
      { id: 6, name: "José" },
    ]);
  });

  it("não duplica quando o id já está na lista", () => {
    const list = [{ id: 6, name: "José" }];
    const created = { id: 6, name: "José" };

    expect(appendDependentToList(list, created)).toEqual(list);
  });
});
