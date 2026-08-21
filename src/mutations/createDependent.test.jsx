import { act, renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";

import { createTestQueryClient } from "@/test/queryClient";
import { DependentController } from "@/controller";
import { QueryKeys } from "@/queries/@config";

import { createDependent } from "./createDependent";

jest.mock("@/controller", () => ({
  DependentController: {
    createDependent: jest.fn(),
  },
}));

const created = {
  id: 6,
  name: "José",
  color: "#557FEA",
  birthDate: "2014-05-23",
};

const payload = {
  name: "José",
  birthDate: "2014-05-23",
  color: "#557FEA",
};

describe("createDependent", () => {
  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useFakeTimers();
  });

  it("desembrulha o dependente, atualiza o cache e dispara o onSuccess da chamada", async () => {
    const client = createTestQueryClient();
    client.setQueryData([QueryKeys.getDependents], [
      { id: 1, name: "João", color: "#557FEA" },
    ]);

    DependentController.createDependent.mockResolvedValueOnce({
      data: created,
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const onSuccess = jest.fn();
    const { result } = await renderHook(() => createDependent(), { wrapper });

    await act(async () => {
      result.current.mutate({ data: payload }, { onSuccess });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(DependentController.createDependent).toHaveBeenCalledWith({
      data: payload,
    });
    expect(onSuccess).toHaveBeenCalledWith(
      created,
      { data: payload },
      undefined,
      expect.anything(),
    );
    expect(client.getQueryData([QueryKeys.getDependents])).toEqual([
      { id: 1, name: "João", color: "#557FEA" },
      created,
    ]);
  });

  it("não duplica o dependente se o id já está no cache", async () => {
    const client = createTestQueryClient();
    client.setQueryData([QueryKeys.getDependents], [created]);

    DependentController.createDependent.mockResolvedValueOnce({
      data: created,
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const { result } = await renderHook(() => createDependent(), { wrapper });

    await act(async () => {
      result.current.mutate({ data: payload });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.getQueryData([QueryKeys.getDependents])).toEqual([created]);
  });

  it("não altera o cache quando a mutation falha", async () => {
    const client = createTestQueryClient();
    const initial = [{ id: 1, name: "João", color: "#557FEA" }];
    client.setQueryData([QueryKeys.getDependents], initial);

    const error = { message: "falhou" };
    DependentController.createDependent.mockRejectedValueOnce(error);

    const wrapper = ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    );

    const onError = jest.fn();
    const { result } = await renderHook(() => createDependent(), { wrapper });

    await act(async () => {
      result.current.mutate({ data: payload }, { onError });
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(onError).toHaveBeenCalled();
    expect(client.getQueryData([QueryKeys.getDependents])).toEqual(initial);
  });
});
