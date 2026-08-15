---
name: project-architecture
description: Mapa da arquitetura do giftpay-family (React Native + Expo, expo-router) e base para QUALQUER nova implementação. Define onde mora cada coisa — chamadas de API em controllers, estado de servidor em hooks react-query com query keys num enum global (queries/@config.js), mutations sempre via mutate()+callbacks, validação em zod, formulários em react-hook-form, estado de feature/UI em zustand, cross-cutting em Context, UI montada com primitivas próprias de components/ui + styled-components, ícones lucide, textos hardcoded em pt-BR, imports pelo alias único @/*, roteamento file-based em src/app — além das convenções inegociáveis e a ordem de implementação (dependência primeiro, UI por último). Use ao planejar ou escrever código novo (componente, hook, controller, store, schema, tela). Complementa o AGENTS.md e a skill plan-prd.
---

# Arquitetura do giftpay-family — base para novas implementações

`giftpay-family` — app **React Native + Expo (managed, expo-router)**, **JavaScript**, full mobile (Android + iOS), idioma **pt-BR** (textos hardcoded). Esta skill é o mapa de **onde mora cada coisa** e o conjunto de **padrões** que toda implementação nova segue. O `AGENTS.md` na raiz é o resumo; aqui está o detalhe operacional.

> Antes de criar qualquer arquivo, ache o vizinho que já faz algo parecido e **imite-o**.

> **Versões de dependência** — nenhuma versão é fixada nesta doc. O `package.json` é a fonte da verdade. Antes de usar uma API que muda entre majors (`@tanstack/react-query` v5, `zod`, `react` 19, `react-native` 0.81, `expo` 54), **leia o range no `package.json`** em vez de assumir.

## A regra de ouro — camadas de rede

Dado flui por **três camadas**. **Componentes/telas NUNCA chamam `api`/axios direto.**

```
controller/*  →  queries/* (leitura) + mutations/* (escrita)  →  tela (app/) ou componente
   (axios)         (react-query: desembrulha/normaliza data, expõe loading/erro/isReady)
```

1. **`controller/<dominio>.controller.js`** — funções finas que envolvem a instância axios (`@/services/api`). Retornam a forma axios (`api.get/post(...)`, resolve com `{data}`), deixam o erro propagar pro interceptor. Re-exportadas com namespace em `controller/index.js` (ex.: `UserController.getProfile()`). **Único ponto de troca entre mock e backend real.**
2. **`queries/*`** (leitura) e **`mutations/*`** (escrita) — hooks **react-query** que chamam o controller, **desembrulham o `data`** e expõem estado. Toda **query key é constante** em `queries/@config.js` (`QueryKeys`) — nunca string solta inline; com argumento vira **array** (`[QueryKeys.getUserDetails, { userId }]`).
3. **Tela/componente** — consome só os hooks.

`services/api.js` (interceptors) cuida sozinho de: injeção do bearer token via `useAuthStore`, retry de 401 via refresh token (`services/refreshToken.js`), e criação de `error.feedback` (toast automático de erro via `sdk/apiErrors`, salvo header `silent: true`).

Esqueletos copiáveis de cada camada: @references/layer-patterns.md · Visão detalhada da camada de rede: @references/api-architecture.md

## Onde mora cada coisa

| Vou criar… | Vai em… |
| --- | --- |
| Chamada de API | `src/controller/<dominio>.controller.js` (+ export em `controller/index.js`) |
| Hook de leitura | `src/queries/<dominio>.js` |
| Hook de escrita | `src/mutations/<acao>.js` |
| Nova query key | `src/queries/@config.js` (`QueryKeys`) |
| Tela / rota | `src/app/(public\|private)/...` (**expo-router**, file-based) |
| Componente compartilhado | `src/components/<Component>/index.jsx` + `styles.js` |
| Primitiva de UI base | já existe em `src/components/ui/*` — **reutilize, não recrie** |
| Estado de feature/UI | store zustand em `src/store/<dominio>.js` |
| Wizard multi-step cross-cutting | `src/context/*.jsx` (Context API) |
| Validação | schema zod em `src/zodSchemes/` (ou junto da feature) |
| Enum/formatter/validator de domínio | `src/sdk/<modulo>/index.js` (+ `test.js`) |
| Estilo de layout de tela | `src/styles/<tela>.js` (styled-components) |
| Texto | string pt-BR hardcoded |

## Imports pelo alias `@/*` (nunca `../../`)

O alias é `@/*` → `./src/*` (`jsconfig.json`). Metro/Expo resolve em runtime; o Jest resolve via `moduleNameMapper`. Ex.: `import { api } from "@/services/api"`, `import { UserController } from "@/controller"`, `import { Button } from "@/components/ui/button"`.

## Estado — três sistemas, por propósito

- **react-query** — todo estado de **servidor/assíncrono** (a camada acima). Keys e `Time(min)` em `queries/@config.js`; `QueryClient` da app montado nos providers (`src/components/Providers.jsx`).
- **zustand** (`store/<dominio>.js`) — estado de **feature/UI**. Padrão: `create(immer(...))`; persistência com `persist` + `createJSONStorage(() => Storage)`, chave `@giftpay-family/<nome>`.
- **Context API** (`context/*.jsx`) — só wizards multi-step. Memoize o `value` do Provider.

Regra prática: dado do backend → react-query (nunca duplique num store). Estado de uma feature (passos, seleções, sheet aberta) → zustand. Fluxo multi-step → Context.

## Formulários

`react-hook-form` + `zodResolver` (`@hookform/resolvers/zod`). Toda validação vive no **schema zod**; as mensagens são **strings pt-BR**. Reutilize os factories de `@/zodSchemes` (`cpfScheme`, `passwordScheme`, `emailScheme`, `phoneScheme`, `nameScheme`, `birthDateSchema`, `confirmationCodeScheme`). Exiba `errors.<campo>?.message`.

## Design system — `components/ui/*`

Reutilize as primitivas do repo (`src/components/ui/`): `Button`, `Input`, `InputPassword`, `Text`, `Checkbox`, `CodeInput`. Estilo shadcn-like com props `variant`/`size`. Antes de criar UI nova, confira se a primitiva já existe. Estilo com **`styled-components/native`** + tokens do `theme` (`theme.colors/fontSize/borderRadius`).

## Tema — tokens de cor

Tokens nomeados pela aparência visual do hex, não por papel semântico:

| Token | Hex | Uso típico |
|---|---|---|
| `teal` | `#2B6E61` | brand primário, foco, ícone ativo |
| `tealDeep` | `#1F4E46` | variante escura do brand |
| `mint` | `#E1EDEA` | superfícies, bordas, background secundário |
| `terracotta` | `#C86042` | accent, ações destrutivas |
| `gold` | `#BB822E` | âmbar/ouro |
| `cream` | `#F6F5F0` | background base |
| `charcoal` | `#202020` | texto principal |
| `stone` | `#6F6F6F` | texto suave / placeholder |

**Sem dark mode** — tema sempre light.

## Convenções inegociáveis

- **Mutations: `mutation.mutate(vars, { onSuccess, onError })`** — callbacks por chamada (navegar, `error.feedback?.dispatch()`, `setError`). O hook segura só efeitos sempre-on (invalidar cache, toast de sucesso). **NUNCA `mutateAsync` + try/catch** (racing) — inegociável; encadeie disparando a próxima no `onSuccess` da anterior.
- **Erro de API**: o interceptor normalmente já dispara o toast (via `error.feedback`). No `onError`, use `error.feedback?.dispatch()` ou trate status específico (ex.: `error.response?.status === 404`). Para suprimir o toast automático, passe `headers: { silent: true }` no controller.
- **Ícones**: `lucide-react-native`. `@expo/vector-icons` só onde já usado.
- **Navegação**: expo-router (`router.push/replace`, `<Link href>`, `useLocalSearchParams`) — nunca API de navegação de outra lib. Tela nova = arquivo em `src/app/...`.
- **Config/env**: `process.env.EXPO_PUBLIC_*` (ex.: `EXPO_PUBLIC_API_BASE_URL`).
- **Sheets**: bottom sheets via `@gorhom/bottom-sheet` orquestradas por `@/store/sheet` (`openSheet(<XSheet/>)`/`closeSheet()`).
- **Toasts**: `ToastSuccess`, `ToastError`, `ToastInfo` de `@/sdk/toast`.

## Receita — adicionar uma feature nova (dependência primeiro, UI por último)

1. **Schema zod** (se há formulário/validação) — em `@/zodSchemes` ou junto da feature.
2. **Controller** em `controller/<dominio>.controller.js` (+ export no index). Retorne a forma axios.
3. **Hook react-query** em `queries/` (leitura) e/ou `mutations/` (escrita), desembrulhando o `data`.
4. **Query key** nova em `queries/@config.js`.
5. **Store zustand** (se a feature tem estado próprio de passos/seleção) ou **Context** (wizard).
6. **Lógica do componente/tela** — `react-hook-form`, handlers que chamam `mutate()` com callbacks.
7. **Montagem da UI** por último, com primitivas de `components/ui/*` + `styled-components` + textos pt-BR.

## Sinais vermelhos — PARE

- Chamada de API (`api.get/post`) fora de um controller.
- Query key como string solta em vez de constante em `queries/@config.js`.
- `mutateAsync` + try/catch (use `mutate()` + callbacks).
- Componente chamando controller direto, pulando o hook react-query.
- Dado de servidor duplicado num store zustand em vez de react-query.
- Recriar uma primitiva que já existe em `components/ui/*`.
- Import relativo `../../` onde o alias `@/` resolve.
- `StyleSheet` novo quando styled-components serve; objeto de estilo inline recriado a cada render.
- Montar a UI antes de a camada de dados existir e estar testada.

## Comandos

```bash
npm start                       # Metro/Expo (use -c pra limpar cache)
npm run android | npm run ios
npm run lint                    # expo lint
npm test                        # jest (preset jest-expo)
npx jest path/to/File.test.js   # um arquivo
npx jest -t "nome do teste"     # por nome
```

Testes colocados ao lado do código (`*.test.js`, ou `sdk/<modulo>/test.js`), `@testing-library/react-native` para componentes/hooks. Use `createTestQueryClient()` de `@/test/queryClient` para hooks react-query (nunca `new QueryClient()` inline).

## Referências

- @references/layer-patterns.md — esqueletos copiáveis (controller, query, mutation, schema zod, form RHF, store zustand, teste)
- @references/api-architecture.md — a camada de rede em detalhe: `services/api.js` (interceptors, auth/refresh, `error.feedback`), controllers, queries, mutations e o enum de query keys
- @references/navigation-and-screens.md — expo-router (grupos, layouts, rotas dinâmicas), guard de auth, providers e a anatomia de uma tela
- `AGENTS.md` (raiz) — resumo da arquitetura

## Skills relacionadas

- **plan-prd** — fluxo de plan mode → PRD; esta skill é a referência de estrutura citada lá.
- **tdd** — implementação test-first após aprovação.
- **code-review** — rode após a implementação.
