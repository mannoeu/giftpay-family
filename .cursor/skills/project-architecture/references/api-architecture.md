# Camada de rede (giftpay-family)

Como o app **consome** a API. Os componentes nunca tocam axios direto — tudo passa por `controller → query/mutation → tela`. Esqueletos copiáveis: @layer-patterns.md.

## Módulos

| Peça | Onde | Papel |
| --- | --- | --- |
| Instância axios + interceptors | `services/api.js` | baseURL (`EXPO_PUBLIC_API_BASE_URL`), bearer token, refresh 401, `error.feedback` |
| Refresh token | `services/refreshToken.js` | fila de refresh, `getOrRunRefresh`, `forceLogout` |
| Controllers | `controller/<dominio>.controller.js` + `controller/index.js` | funções finas sobre o axios |
| Queries (leitura) | `queries/<dominio>.js` | hooks `useQuery`/`useInfiniteQuery`, desembrulham `data`, expõem `isReady` |
| Mutations (escrita) | `mutations/<acao>.js` | hooks `useMutation`; consumidos via `mutate()` + callbacks |
| Enum de query keys | `queries/@config.js` | `QueryKeys` + helper `Time(min)` |
| Paginação | `sdk/api.js` | `convertPageToOffset`, `getNextPageParam` (⚠️ **não** é o cliente HTTP) |
| Feedback de erro | `sdk/apiErrors.js` | classe `Feedback` + `createFeedback` (offline/500/404/403/400-401/genérico) |
| Toast | `sdk/toast.js` | `ToastSuccess/ToastError/ToastInfo` (mobile only) |

## `services/api.js` — a instância única

`api = axios.create({ baseURL: process.env.EXPO_PUBLIC_API_BASE_URL, ... })`.

### Interceptor de request

1. Se há um refresh em andamento (`getRefreshPromiseIfAny()`), o request espera o refresh resolver e só então segue.
2. Injeta `Authorization: Bearer <access_token>` a partir de `useAuthStore.getState().token` — a menos que o request já traga `Authorization`.

### Interceptor de response

- **401 → refresh** — se não for endpoint de login/refresh, chama `getOrRunRefresh(apiConfig)` e, no sucesso, **repete o request original** (removendo o `Authorization` antigo). Falhou → `forceLogout()`.
- **`error.feedback`** — para todo erro, cria um `Feedback` via `createFeedback({ status, response, notify, canceled })` e anexa em `error.feedback`. `notify` mostra o toast automaticamente, salvo quando o request mandou header `silent: true`.
- A promise **rejeita** sempre (exceto o fluxo de refresh) — quem trata é o `onError` da mutation/query.

> Consequência prática: **na maioria dos casos você não dispara toast de erro manualmente** — o interceptor já criou `error.feedback` e (se `notify`) já emitiu. No `onError`, chame `error.feedback?.dispatch()` para re-emitir/garantir, ou trate um status específico. Para silenciar, mande `headers: { silent: true }` no controller.

## `sdk/apiErrors.js` — o padrão `Feedback`

`createFeedback` inspeciona rede + status e devolve um `Feedback` (`title`, `messages`, `formMessages`, `dispatch()`):

- offline (`Network.getNetworkStateAsync`), request cancelado, `500/502`, `404`, `403` sem corpo, `400/401` (monta `formMessages` a partir do corpo), genérico.
- `feedback.dispatch()` emite o toast (`ToastError`/`ToastInfo`).

## Controllers — `controller/*`

Funções finas que retornam a **forma axios**. Uma por domínio, re-exportadas com namespace no `controller/index.js`:

```js
export * as UserController from "./user.controller";
export * as AuthController from "./auth.controller";
```

Consumo: `UserController.getProfile()`. **Único ponto de troca mock ↔ backend.**

## Queries — `queries/*`

`useQuery`/`useInfiniteQuery` que chamam o controller e desembrulham `data`.

- `queryKey` **sempre** de `QueryKeys`; com argumento → array (`[QueryKeys.getUserDetails, { userId }]`).
- Expõem `isReady = !(errorUpdateCount > 0 || !isFetched || isError)` e, em listas, `isEmpty` + `resetQueries`.
- `enabled: !!id` quando dependem de um argumento que pode faltar.
- `staleTime: Time(min)`.

## Mutations — `mutations/*`

`useMutation` chamando o controller.

- **Consumo: `mutation.mutate(vars, { onSuccess, onError })`.** Callbacks específicos da chamada vão no `mutate()`; o hook segura só efeitos sempre-on (invalidação, toast de sucesso).
- **NUNCA `mutateAsync` + try/catch** — causa racing/ordem errada. Encadeie disparando a próxima mutation no `onSuccess` da anterior.
- Invalidação no `onSuccess` do hook: `queryClient.invalidateQueries({ queryKey: [QueryKeys.x] })`.

## Enum de query keys — `queries/@config.js`

Objeto plano `QueryKeys` (kebab-case) + helper `Time(minutes)`. **Nunca** use string literal de key inline — crie a constante em `QueryKeys`.

## Testando a camada de rede

- **Controller**: `jest.mock("@/services/api")`, asserta o shape da chamada e o passthrough do `data`.
- **Query/Mutation**: `renderHook` dentro de `QueryClientProvider` com `createTestQueryClient()` de `@/test/queryClient` (sem retry, `gcTime: Infinity`) — **nunca** `new QueryClient()` inline (vaza o timer de GC e segura o worker do Jest).

Detalhes de teste e o ciclo TDD: skill **tdd**.
