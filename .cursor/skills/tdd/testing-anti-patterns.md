# Anti-padrões de teste (giftpay-family)

**Carregue esta referência quando:** escrever/alterar testes, adicionar `jest.mock`, ou se sentir tentado a colocar método só-de-teste em código de produção.

## Visão geral

Testes verificam comportamento real, não comportamento de mock. Mocks isolam a **fronteira externa** — neste app, essencialmente `@/services/api` (a instância axios) e libs nativas (câmera `expo-camera`, `expo-network`, etc.). Eles **não** são a coisa sendo testada.

**Princípio central:** teste o que o código faz, não o que o mock faz.

## As Leis de Ferro

```
1. NUNCA teste o comportamento do mock
2. NUNCA adicione método só-de-teste em código de produção
3. NUNCA mocke sem entender as dependências (interceptor, error.feedback, toast, navegação, efeitos)
```

## Anti-padrão 1: testar o comportamento do mock

**A violação:**
```js
// ❌ RUIM: mocka a própria unidade sob teste e asserta que o mock foi chamado
jest.mock("@/mutations/authenticate", () => ({ authenticate: jest.fn() }));

it("autentica", () => {
  const mutate = jest.fn();
  authenticate.mockReturnValue({ mutate });
  expect(mutate).toHaveBeenCalled(); // testa o mock, não o comportamento
});
```

**O conserto:**
```js
// ✅ BOM: roda o hook real, mocka só @/services/api, asserta o efeito real
import { api } from "@/services/api";
jest.mock("@/services/api", () => ({ api: { post: jest.fn() } }));

it("autentica e salva o token", async () => {
  api.post.mockResolvedValueOnce({ data: { access: "tok", refresh: "ref" } });
  const onSuccess = jest.fn();
  const { result } = renderHook(() => authenticate(), { wrapper });

  await act(async () => {
    result.current.mutate({ username: "u", password: "p" }, { onSuccess });
  });

  expect(onSuccess).toHaveBeenCalled();
});
```

## Anti-padrão 2: método só-de-teste em produção

**O conserto:**
```js
// ✅ BOM: use a action real de reset que o app já tem
afterEach(() => useFooStore.getState().reset?.());

// fixtures de teste vivem em helpers de teste, não no código de produção
export const makeFoo = (over = {}) => ({ id: "f1", name: "Foo", ...over });
```

## Anti-padrão 3: mockar sem entender

Mocke só a fronteira externa (`@/services/api`) e deixe o `error.feedback`/toast reais rodarem, ou espione (`jest.spyOn`) o ponto exato que você quer verificar.

## Anti-padrão 4: mocks incompletos (resposta de API)

Mocke a resposta **completa** como o backend devolve (snake_case, campos aninhados que o reshape lê), não só os campos do seu assert imediato. Olhe o `return` do `queryFn` para saber o shape consumido.

## Referência rápida

| Anti-padrão | Conserto |
|-------------|----------|
| Assertar que um mock foi chamado (unidade sob teste) | Asserte estado/data/erro real |
| Método só-de-teste no store/componente | Mova pra factory/helper; use a action real (`reset()`) |
| Mockar sem entender | Rastreie interceptor/error.feedback/toast/navegação; mocke o mínimo |
| Resposta de API incompleta | Espelhe o payload real por completo (aninhado, snake_case) |
| Teste como pós-pensamento | TDD — teste primeiro, depois `npm test` inteiro |
| Mock complexo demais | Use teste de lógica real (safeParse/renderHook); mocke só a fronteira |

**Mocks isolam a fronteira externa (`@/services/api`, libs nativas). Não são coisas a testar.** Teste comportamento real (`data` do hook, estado do store, mensagem pt-BR do erro, payload do controller).
