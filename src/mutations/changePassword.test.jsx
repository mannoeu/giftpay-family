import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { createTestQueryClient } from "@/test/queryClient";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { changePassword } from "./changePassword";

jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

jest.mock("@/sdk/toast", () => ({
  ToastSuccess: jest.fn(),
}));

const resetAuthStore = () => {
  useAuthStore.setState({
    token: null,
    user: null,
    isRefreshingToken: false,
    isFirstAccess: true,
  });
};

const wrapper = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("changePassword", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    resetAuthStore();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("envia a nova senha e encerra o primeiro acesso no sucesso", async () => {
    api.post.mockResolvedValueOnce({ data: {} });

    const { result } = await renderHook(() => changePassword(), { wrapper });

    await act(async () => {
      result.current.mutate({ password: "novaSenha1" });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(api.post).toHaveBeenCalledWith("/main/user/change_password", {
      password: "novaSenha1",
    });
    expect(useAuthStore.getState().isFirstAccess).toBe(false);
  });
});
