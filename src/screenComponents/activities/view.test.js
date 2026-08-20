import {
  FAMILY_FILTER_ID,
  getActivitiesEmptyMessage,
  getActivitiesFilterButtonLabel,
  getActivitiesFilterName,
  isActivitiesFilterActive,
} from "./view";

const dependents = [
  { id: 1, name: "João", color: "#557FEA" },
  { id: 2, name: "Maria", color: "#C06990" },
];

describe("getActivitiesFilterName", () => {
  it("usa Todos quando o filtro é a família", () => {
    expect(getActivitiesFilterName(FAMILY_FILTER_ID, dependents)).toBe(
      "Todos",
    );
  });

  it("usa o nome do filho quando o parentId está na lista", () => {
    expect(getActivitiesFilterName(1, dependents)).toBe("João");
  });

  it("aceita parentId como string", () => {
    expect(getActivitiesFilterName("2", dependents)).toBe("Maria");
  });

  it("volta para Todos quando o parentId não existe", () => {
    expect(getActivitiesFilterName(99, dependents)).toBe("Todos");
  });
});

describe("getActivitiesFilterButtonLabel", () => {
  it("prefixa Filtrar no nome atual", () => {
    expect(getActivitiesFilterButtonLabel(FAMILY_FILTER_ID, dependents)).toBe(
      "Filtrar: Todos",
    );
    expect(getActivitiesFilterButtonLabel(1, dependents)).toBe("Filtrar: João");
  });
});

describe("isActivitiesFilterActive", () => {
  it("fica inativo quando o filtro é a família", () => {
    expect(isActivitiesFilterActive(FAMILY_FILTER_ID)).toBe(false);
    expect(isActivitiesFilterActive("")).toBe(false);
  });

  it("fica ativo quando um filho está selecionado", () => {
    expect(isActivitiesFilterActive(1)).toBe(true);
    expect(isActivitiesFilterActive("1")).toBe(true);
  });
});

describe("getActivitiesEmptyMessage", () => {
  it("usa a mensagem da família quando o filtro é Todos", () => {
    expect(getActivitiesEmptyMessage(FAMILY_FILTER_ID, dependents)).toBe(
      "Faça uma recarga para começar a usar os cartões",
    );
  });

  it("usa o nome do filho no empty filtrado", () => {
    expect(getActivitiesEmptyMessage(1, dependents)).toBe(
      "Faça uma recarga para João usar seu cartão",
    );
  });
});
