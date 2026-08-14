import { api } from "@/services/api";
import { changePassword, login } from "./auth.controller";

jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn(), patch: jest.fn() },
}));

describe("AuthController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /login/token/ com username e password", async () => {
    api.post.mockResolvedValueOnce({ data: { access: "a", refresh: "r" } });

    const res = await login({ username: "12345678909", password: "senha123" });

    expect(api.post).toHaveBeenCalledWith("/login/token/", {
      username: "12345678909",
      password: "senha123",
    });
    expect(res.data).toEqual({ access: "a", refresh: "r" });
  });

  it("POST /main/user/change_password com a nova senha", async () => {
    api.post.mockResolvedValueOnce({ data: {} });

    const res = await changePassword({ password: "novaSenha1" });

    expect(api.post).toHaveBeenCalledWith("/main/user/change_password", {
      password: "novaSenha1",
    });
    expect(res.data).toEqual({});
  });
});
