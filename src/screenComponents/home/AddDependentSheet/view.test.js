import { getAddDependentSuccessCopy } from "./view";

describe("getAddDependentSuccessCopy", () => {
  it("interpola o nome no título e no corpo", () => {
    expect(getAddDependentSuccessCopy("José")).toEqual({
      title: "Bem vindo à família, José!",
      body: "Agora você precisa vincular um cartão físico e fazer uma recarga para que José comece a usar o app.",
    });
  });
});
