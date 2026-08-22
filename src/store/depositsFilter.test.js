import { useDepositsFilterStore } from "./depositsFilter";

describe("useDepositsFilterStore", () => {
  beforeEach(() => {
    useDepositsFilterStore.getState().reset();
  });

  it("começa filtrando todos os status", () => {
    expect(useDepositsFilterStore.getState().status).toBeNull();
  });

  it("guarda o status selecionado", () => {
    useDepositsFilterStore.getState().setStatus("pending");

    expect(useDepositsFilterStore.getState().status).toBe("pending");
  });

  it("volta para Todos ao resetar", () => {
    useDepositsFilterStore.getState().setStatus("paid");
    useDepositsFilterStore.getState().reset();

    expect(useDepositsFilterStore.getState().status).toBeNull();
  });

  it("normaliza string vazia para Todos", () => {
    useDepositsFilterStore.getState().setStatus("");

    expect(useDepositsFilterStore.getState().status).toBeNull();
  });
});
