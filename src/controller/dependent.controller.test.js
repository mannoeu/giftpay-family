import {
  createDependent,
  getDependents,
  resetMockDependents,
} from "./dependent.controller";

const josePayload = {
  name: "José",
  birthDate: "2014-05-23",
  color: "#557FEA",
};

const flushDelay = async () => {
  await jest.runAllTimersAsync();
};

describe("DependentController.createDependent", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetMockDependents();
  });

  afterEach(() => {
    resetMockDependents();
    jest.useRealTimers();
  });

  it("resolve o dependente criado e inclui na lista", async () => {
    const pendingCreate = createDependent({ data: josePayload });
    await flushDelay();
    const created = await pendingCreate;

    expect(created.data).toEqual({
      id: 6,
      name: "José",
      color: "#557FEA",
      birthDate: "2014-05-23",
    });

    const pendingList = getDependents();
    await flushDelay();
    const { data } = await pendingList;

    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 6, name: "José", color: "#557FEA" }),
      ]),
    );
  });

  it("incrementa o id em creates seguidos", async () => {
    const firstPending = createDependent({ data: josePayload });
    await flushDelay();
    const first = await firstPending;

    const secondPending = createDependent({
      data: { ...josePayload, name: "Clara" },
    });
    await flushDelay();
    const second = await secondPending;

    expect(first.data.id).toBe(6);
    expect(second.data.id).toBe(7);

    const pendingList = getDependents();
    await flushDelay();
    const { data } = await pendingList;
    const names = data.map((item) => item.name);

    expect(names).toEqual(
      expect.arrayContaining(["José", "Clara"]),
    );
  });

  it("resetMockDependents restaura os cinco originais", async () => {
    const pendingCreate = createDependent({ data: josePayload });
    await flushDelay();
    await pendingCreate;

    resetMockDependents();

    const pendingList = getDependents();
    await flushDelay();
    const { data } = await pendingList;

    expect(data).toHaveLength(5);
    expect(data.map((item) => item.id)).toEqual([1, 2, 3, 4, 5]);
  });
});
