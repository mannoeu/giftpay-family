import {
  buildLoginPayload,
  resolveAuthRedirect,
  resolveInitialHref,
  AuthRoutes,
} from "@/sdk/auth";

describe("buildLoginPayload", () => {
  it("envia o CPF só com dígitos como username", () => {
    expect(
      buildLoginPayload({ cpf: "123.456.789-09", password: "senha123" }),
    ).toEqual({
      username: "12345678909",
      password: "senha123",
    });
  });
});

describe("resolveAuthRedirect", () => {
  it("manda não autenticado na área privada para o login", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: false,
        isFirstAccess: false,
        segments: ["(private)", "home"],
      }),
    ).toBe(AuthRoutes.login);
  });

  it("manda não autenticado no primeiro acesso para o login", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: false,
        isFirstAccess: true,
        segments: ["first-access"],
      }),
    ).toBe(AuthRoutes.login);
  });

  it("não redireciona não autenticado que já está no login", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: false,
        isFirstAccess: false,
        segments: ["(public)", "login"],
      }),
    ).toBeNull();
  });

  it("manda autenticado em primeiro acesso para a tela de criar senha", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: true,
        segments: ["(public)", "login"],
      }),
    ).toBe(AuthRoutes.firstAccess);
  });

  it("impede autenticado em primeiro acesso de entrar no dashboard", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: true,
        segments: ["(private)", "home"],
      }),
    ).toBe(AuthRoutes.firstAccess);
  });

  it("não redireciona autenticado em primeiro acesso que já está na tela certa", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: true,
        segments: ["first-access"],
      }),
    ).toBeNull();
  });

  it("manda autenticado sem primeiro acesso do login para o dashboard", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: false,
        segments: ["(public)", "login"],
      }),
    ).toBe(AuthRoutes.home);
  });

  it("manda autenticado sem primeiro acesso da tela de criar senha para o dashboard", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: false,
        segments: ["first-access"],
      }),
    ).toBe(AuthRoutes.home);
  });

  it("não redireciona autenticado sem primeiro acesso que já está no dashboard", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: false,
        segments: ["(private)", "home"],
      }),
    ).toBeNull();
  });

  it("não redireciona autenticado com segments vazios", () => {
    expect(
      resolveAuthRedirect({
        isAuthenticated: true,
        isFirstAccess: false,
        segments: [],
      }),
    ).toBeNull();
  });
});

describe("resolveInitialHref", () => {
  it("manda não autenticado para o login", () => {
    expect(
      resolveInitialHref({
        isAuthenticated: false,
        isFirstAccess: false,
        pendingHref: "/(private)/home",
      }),
    ).toBe(AuthRoutes.login);
  });

  it("manda autenticado em primeiro acesso para criar senha", () => {
    expect(
      resolveInitialHref({
        isAuthenticated: true,
        isFirstAccess: true,
        pendingHref: "/(private)/home",
      }),
    ).toBe(AuthRoutes.firstAccess);
  });

  it("abre o destino do push se autenticado e não for primeiro acesso", () => {
    expect(
      resolveInitialHref({
        isAuthenticated: true,
        isFirstAccess: false,
        pendingHref: "/(private)/card",
      }),
    ).toBe("/(private)/card");
  });

  it("abre o dashboard se autenticado sem push pendente", () => {
    expect(
      resolveInitialHref({
        isAuthenticated: true,
        isFirstAccess: false,
        pendingHref: null,
      }),
    ).toBe(AuthRoutes.home);
  });
});
