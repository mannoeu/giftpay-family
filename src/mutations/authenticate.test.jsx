import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { createTestQueryClient } from "@/test/queryClient";
import { api } from "@/services/api";
import { useAuthStore } from "@/store/auth";
import { authenticate } from "./authenticate";

jest.mock("@/services/api", () => ({
  api: { get: jest.fn(), post: jest.fn() },
}));

const resetAuthStore = () => {
  useAuthStore.setState({
    token: null,
    user: null,
    isRefreshingToken: false,
    isFirstAccess: false,
  });
};

const wrapper = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

describe("authenticate", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    resetAuthStore();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("grava token e marca primeiro acesso quando a API indica", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        access: "access-token",
        refresh: "refresh-token",
        is_first_access: true,
      },
    });

    const { result } = await renderHook(() => authenticate(), { wrapper });

    await act(async () => {
      result.current.mutate({
        username: "12345678909",
        password: "senha123",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const state = useAuthStore.getState();
    expect(state.token).toEqual({
      access_token: "access-token",
      refresh_token: "refresh-token",
    });
    expect(state.isFirstAccess).toBe(true);
  });

  it("grava token sem primeiro acesso quando a API não indica", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        access: "access-token",
        refresh: "refresh-token",
        is_first_access: false,
      },
    });

    const { result } = await renderHook(() => authenticate(), { wrapper });

    await act(async () => {
      result.current.mutate({
        username: "12345678909",
        password: "senha123",
      });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(useAuthStore.getState().isFirstAccess).toBe(false);
    expect(useAuthStore.getState().token?.access_token).toBe("access-token");
  });
});
