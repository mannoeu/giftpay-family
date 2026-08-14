# Padrões por camada — esqueletos copiáveis

Esqueletos mínimos de cada camada. Copie, renomeie, ajuste. Tudo em JavaScript.

---

## 1. Controller — `src/controller/<dominio>.controller.js`

Função fina sobre o axios. Retorna a forma axios e deixa o erro propagar (o interceptor trata).

```js
import { api } from "@/services/api";
import { convertPageToOffset } from "@/sdk/api";

export const getFoo = ({ id }) => api.get(`/main/foo/${id}`);

export const getFooList = ({ page = 1, pageSize = 10 }) => {
  const { offset, limit } = convertPageToOffset(page, pageSize);
  return api.get(`/main/foo?offset=${offset}&limit=${limit}`);
};

export const createFoo = ({ data }) => api.post(`/main/foo`, data);
```

Suprimir o toast automático de erro num request específico:

```js
export const validateFoo = ({ value }) =>
  api.get(`/main/foo/validate?value=${value}`, { headers: { silent: true } });
```

Registre o namespace em `controller/index.js`:

```js
export * as FooController from "./foo.controller";
```

**Mock antes do backend existir:** escreva o controller devolvendo a mesma forma axios (`Promise.resolve({ data })`) e, quando o endpoint existir, troque só o corpo — query/mutation/tela não mudam.

---

## 2. Query key — `src/queries/@config.js`

Adicione a key ao `QueryKeys`:

```js
export const QueryKeys = {
  // …existentes,
  getFoo: "get-foo",
  getFooList: "get-foo-list",
};

export const Time = (minutes = 1) => minutes * 60 * 1000;
```

---

## 3. Query (leitura) — `src/queries/<dominio>.js`

Chama o controller, **desembrulha o `data`**, expõe `isReady`.

```js
import { useQuery } from "@tanstack/react-query";
import { FooController } from "@/controller";
import { QueryKeys, Time } from "./@config";

export const useFooQuery = ({ id, ...options } = {}) => {
  const Query = useQuery({
    enabled: !!id,
    queryKey: [QueryKeys.getFoo, { id }],
    queryFn: async () => {
      const { data } = await FooController.getFoo({ id });
      return data;
    },
    staleTime: Time(5),
    ...options,
  });

  const isReady = !(Query.errorUpdateCount > 0 || !Query.isFetched || Query.isError);
  return { ...Query, isReady };
};
```

Listas paginadas → `useInfiniteQuery` com `getNextPageParam` de `@/sdk/api`, expondo também `isEmpty` e `resetQueries`.

Se a reformatação do `data` for mais que trivial, **extraia um serializer exportado** (função pura, fora do hook) e chame-o no `queryFn` — testável isoladamente.

---

## 4. Mutation (escrita) — `src/mutations/<acao>.js`

Factory que devolve o `useMutation`. Quem consome usa `mutate()` + callbacks. Invalide as query keys afetadas no `onSuccess`.

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FooController } from "@/controller";
import { QueryKeys } from "@/queries/@config";
import { ToastSuccess } from "@/sdk/toast";

export const createFoo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }) => FooController.createFoo({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.getFooList] });
      ToastSuccess("Tudo certo!");
    },
  });
};
```

### Consumindo a mutation (no componente/tela)

```js
const { mutate: doCreateFoo, isPending } = createFoo();

// ✅ sempre assim — callbacks por chamada, no mutate():
doCreateFoo(
  { data },
  {
    onSuccess: () => router.replace("/(private)/home"),
    onError: (error) => {
      if (error?.response?.status === 404) ToastInfo("Não encontrado");
      else error?.feedback?.dispatch();
    },
  }
);

// ❌ NUNCA:
// try { await createFooAsync({ data }); } catch (e) { ... }
```

Encadear várias mutations: dispare a próxima no `onSuccess` da anterior — nunca `await mutateAsync` em sequência.

---

## 5. Schema zod — `src/zodSchemes/index.js` (ou junto da feature)

Toda validação no schema; mensagens são **strings pt-BR**. Predicados puros ficam em `@/sdk/validator` e o schema só compõe.

```js
import { z } from "zod";

// predicado puro em sdk/validator.js
const isValidCPF = (cpf) => { /* lógica */ return true; };

export const cpfScheme = () =>
  z.string().min(14, { message: "CPF incompleto" }).refine(isValidCPF, { message: "CPF inválido" });

export const passwordScheme = () =>
  z
    .string()
    .min(8, { message: "Mínimo de 8 caracteres" })
    .refine((v) => !/^\s/.test(v) && !/\s$/.test(v), {
      message: "Não deve iniciar ou finalizar com espaços em branco",
    });
```

Regras compostas / entre campos → `superRefine` com `ctx.addIssue({ code: z.ZodIssueCode.custom, message })`. Um schema de formulário monta um `z.object({ ... })` combinando os factories.

---

## 6. Formulário com react-hook-form + zod (tela em `src/app/`)

```jsx
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input, InputPassword } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cpfScheme, passwordScheme } from "@/zodSchemes";

const formScheme = z.object({ cpf: cpfScheme(), password: passwordScheme() });

export const FooForm = () => {
  const { mutate, isPending } = someMutation();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(formScheme),
    defaultValues: { cpf: "", password: "" },
  });

  const onSubmit = (values) => {
    if (isPending) return;
    mutate({ username: values.cpf.replace(/\D/g, ""), password: values.password });
  };

  return (
    <>
      <Controller
        control={control}
        name="cpf"
        render={({ field: { value, onChange } }) => (
          <Input value={value} onChangeText={onChange} placeholder="CPF" />
        )}
      />
      {errors.cpf && <Text color={theme.colors.terracotta}>{errors.cpf.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { value, onChange } }) => (
          <InputPassword value={value} onChangeText={onChange} placeholder="Senha" />
        )}
      />
      {errors.password && <Text color={theme.colors.terracotta}>{errors.password.message}</Text>}

      <Button onPress={handleSubmit(onSubmit)} loading={isPending}>Entrar</Button>
    </>
  );
};
```

> `errors.<campo>?.message` já é a string pt-BR (o schema emitiu o texto).

---

## 7. Store zustand — `src/store/<dominio>.js`

`create` + `immer`; persistência opcional. Chave: `@giftpay-family/<nome>`.

```js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { Storage } from "@/sdk/storage";

export const useFooStore = create(
  persist(
    immer((set) => ({
      value: null,
      setValue: (value) => set((state) => { state.value = value; }),
      reset: () => set((state) => { state.value = null; }),
    })),
    { name: "@giftpay-family/foo", storage: createJSONStorage(() => Storage) }
  )
);
```

Efêmera (sem persist): só `create(immer((set) => ({ ... })))`.

---

## 8. Teste (colocado, `*.test.js`)

Teste a **lógica**, não a renderização. Mock só a fronteira `@/services/api`. Cubra toda lógica nova/tocada.

**Schema via `safeParse`:**

```js
import { cpfScheme } from "@/zodSchemes";
const schema = cpfScheme();

it("reprova CPF incompleto", () => {
  const r = schema.safeParse("123");
  expect(r.success).toBe(false);
  expect(r.error.issues[0].message).toBe("CPF incompleto");
});
```

**Controller — mock `@/services/api`:**

```js
import { api } from "@/services/api";
import { getFoo } from "./foo.controller";

jest.mock("@/services/api", () => ({ api: { get: jest.fn(), post: jest.fn() } }));

it("GET /main/foo/:id", async () => {
  api.get.mockResolvedValueOnce({ data: { id: 1, name: "Foo" } });
  const res = await getFoo({ id: 1 });
  expect(api.get).toHaveBeenCalledWith("/main/foo/1");
  expect(res.data).toEqual({ id: 1, name: "Foo" });
});
```

**Hook react-query via `renderHook`** — `QueryClientProvider` com `createTestQueryClient()` de `@/test/queryClient`:

```jsx
import { renderHook, waitFor } from "@testing-library/react-native";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTestQueryClient } from "@/test/queryClient";
import { api } from "@/services/api";
import { useFooQuery } from "./foo";

jest.mock("@/services/api", () => ({ api: { get: jest.fn() } }));

const wrapper = ({ children }) => {
  const client = createTestQueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
};

it("useFooQuery entrega o data", async () => {
  api.get.mockResolvedValueOnce({ data: { id: 1, name: "Foo" } });
  const { result } = renderHook(() => useFooQuery({ id: 1 }), { wrapper });
  await waitFor(() => expect(result.current.isReady).toBe(true));
  expect(result.current.data).toEqual({ id: 1, name: "Foo" });
});
```

**Action de store** — chame direto (sem render):

```js
import { useFooStore } from "@/store/foo";

it("setValue atualiza o estado", () => {
  useFooStore.getState().setValue(42);
  expect(useFooStore.getState().value).toBe(42);
  useFooStore.getState().reset();
});
```

Rodar um arquivo: `npx jest src/queries/foo.test.js`. Ver a skill **tdd** para o ciclo RED → GREEN → REFACTOR.
