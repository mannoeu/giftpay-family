import { useAuthStore, partializeAuthSession } from "@/store/auth";

const resetAuthStore = () => {
  useAuthStore.setState({
    token: null,
    user: null,
    isRefreshingToken: false,
    isFirstAccess: false,
  });
};

describe("partializeAuthSession", () => {
  it("não persiste token nem user durante o primeiro acesso", () => {
    expect(
      partializeAuthSession({
        token: { access_token: "a", refresh_token: "r" },
        user: { id: 1 },
        isFirstAccess: true,
        isRefreshingToken: false,
      }),
    ).toEqual({ token: null, user: null });
  });

  it("persiste token e user quando o primeiro acesso já terminou", () => {
    const token = { access_token: "a", refresh_token: "r" };
    const user = { id: 1 };

    expect(
      partializeAuthSession({
        token,
        user,
        isFirstAccess: false,
        isRefreshingToken: true,
      }),
    ).toEqual({ token, user });
  });
});


describe("useAuthStore", () => {
  beforeEach(() => {
    resetAuthStore();
  });

  it("setToken grava o token e o flag de primeiro acesso no mesmo update", () => {
    useAuthStore.getState().setToken({
      access_token: "access",
      refresh_token: "refresh",
      isFirstAccess: true,
    });

    const state = useAuthStore.getState();
    expect(state.token).toEqual({
      access_token: "access",
      refresh_token: "refresh",
    });
    expect(state.isFirstAccess).toBe(true);
  });

  it("setToken sem isFirstAccess assume que não é primeiro acesso", () => {
    useAuthStore.getState().setToken({
      access_token: "access",
      refresh_token: "refresh",
    });

    expect(useAuthStore.getState().isFirstAccess).toBe(false);
  });

  it("setFirstAccess atualiza só o flag", () => {
    useAuthStore.getState().setToken({
      access_token: "access",
      refresh_token: "refresh",
      isFirstAccess: true,
    });

    useAuthStore.getState().setFirstAccess(false);

    expect(useAuthStore.getState().isFirstAccess).toBe(false);
    expect(useAuthStore.getState().token?.access_token).toBe("access");
  });

  it("signOut limpa token, user e primeiro acesso", () => {
    useAuthStore.getState().setToken({
      access_token: "access",
      refresh_token: "refresh",
      isFirstAccess: true,
    });
    useAuthStore.getState().setUser({ id: 1 });

    useAuthStore.getState().signOut();

    const state = useAuthStore.getState();
    expect(state.token).toBeNull();
    expect(state.user).toBeNull();
    expect(state.isFirstAccess).toBe(false);
  });
});
