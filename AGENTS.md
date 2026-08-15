# AGENTS.md

Contexto rápido para trabalhar neste repo. É uma **visão geral** — o detalhe operacional
(onde mora cada coisa, esqueletos copiáveis por camada, a receita de implementação) está na
skill **`project-architecture`** (`.cursor/skills/project-architecture/`). Mantenha este arquivo curto.

## O que é isto

`giftpay-family` — app **React Native + Expo (managed, expo-router)** voltado para famílias na plataforma GiftPay.
Stack: **JavaScript**. Idioma do app: **pt-BR** (textos hardcoded). Full mobile — **sem versão web** (apenas Android e iOS).

> **Versões de dependências** — este doc e as skills nunca fixam números de versão. O `package.json`
> é a única fonte da verdade. Antes de qualquer decisão sensível a versão (API que mudou entre
> majors — ex.: `@tanstack/react-query` v5, `zod`, `react` 19, `react-native` 0.81, `expo` 54),
> leia o range no `package.json` em vez de supor.

## Comandos

```bash
npm start          # Metro/Expo (use -c para limpar cache após mexer em babel/alias)
npm run android    # expo run:android
npm run ios        # expo run:ios
npm run lint       # expo lint
npm test           # jest (preset jest-expo) — watch
npm run test:ci    # jest uma vez, sem watch (CI / suíte completa)
npx jest path/to/File.test.js   # um arquivo
npx jest -t "nome"              # por nome do teste
```

## Stack

- **Estado de servidor/assíncrono**: `@tanstack/react-query` v5.
- **Formulários**: `react-hook-form` + `@hookform/resolvers/zod` (`zod`).
- **Estado de feature/UI**: `zustand` (com `immer`; stores persistidas usam `persist` + `createJSONStorage(() => Storage)`, onde `Storage` é `@/sdk/storage`).
- **Design system**: componentes próprios em `@/components/ui/*` (estilo shadcn-like, com `variant`/`size`). Estilização: **`styled-components/native`** (dominante) + `ThemeProvider`.
- **Ícones**: `lucide-react-native` (dominante); `@expo/vector-icons` pontual.
- **Textos**: strings hardcoded em **pt-BR**.
- **Navegação**: **expo-router** (file-based) em `src/app/`, grupos `(public)`/`(private)`.
- **Tema**: sempre light — sem dark mode. Tokens nomeados pela cor visual: `teal`, `tealDeep`, `mint`, `terracotta`, `gold`, `cream`, `charcoal`, `stone`.
- **Fontes**: Outfit (Light, Regular, SemiBold, Bold).
- **Erro/observabilidade**: interceptor em `services/api.js` → `error.feedback` (ver `sdk/apiErrors`) + toast mobile (`sdk/toast`).

## Layout de pastas (`src/`, importado pelo alias único `@/*`)

O único alias é `@/*` → `./src/*` (definido em `jsconfig.json`; Metro/Expo resolve; o Jest usa `moduleNameMapper`). **Nunca use `../../`** quando o `@/` resolve.

- `app/` — telas + roteamento (**expo-router**). Grupos `(public)` e `(private)`, layouts `_layout.jsx`, rotas dinâmicas `[param].jsx`.
- `controller/` — camada HTTP: funções finas sobre o axios (uma por domínio, `*.controller.js`); barrel namespaced em `controller/index.js`. Único ponto de troca mock ↔ backend.
- `queries/` — hooks react-query de **leitura**. Query keys são constantes em `queries/@config.js` (`QueryKeys`) + helper `Time(min)`.
- `mutations/` — hooks react-query de **escrita** (um por ação).
- `sdk/` — um módulo por pasta (`sdk/<modulo>/index.js` + `test.js` quando houver teste). Utilitários de domínio (enums, formatters, validators), `toast`, `storage`, e `api` (**paginação**, NÃO o cliente HTTP). Pacotes maiores (ex.: `push-notification/`) seguem o mesmo padrão.
- `services/` — `api.js` (instância axios + interceptors) e `refreshToken.js`.
- `store/` — stores **zustand** (auth, sheet, camera, tabBar…).
- `components/` — UI compartilhada: primitivas em `ui/`, componentes de domínio, pasta-por-componente `Component/index.jsx` + `Component/styles.js`.
- `zodSchemes/` — schemas/validadores zod reutilizáveis.
- `styles/` — `styled-components` de **layout de tela** (importados como `import * as S from "@/styles/<tela>"`).
- `theme/` — tokens (`colors`, `fontSize`, `borderRadius`).
- `hooks/` — hooks utilitários. `assets/` — estáticos.

## Arquitetura — o camadamento de rede (a regra central)

Os dados fluem por três camadas. **Componentes/telas NUNCA chamam `api`/axios diretamente.**

```
controller/*  →  queries/* (leitura) + mutations/* (escrita)  →  tela em app/ ou componente
  (axios)          (react-query: normaliza data, expõe loading/erro/isReady)
```

1. **`controller/*.controller.js`** — devolve a forma axios (`api.get/post(...)` retornando `{data}`), deixa o erro propagar pro interceptor. Re-export namespaced em `controller/index.js` (ex.: `UserController.getProfile()`).
2. **`queries/*` / `mutations/*`** — chamam o controller, desembrulham/reformatam `data`, expõem estado. Query keys sempre de `queries/@config.js` (`QueryKeys`), como **array quando há argumento** (`[QueryKeys.getUserDetails, { userId }]`).
3. **Tela/componente** — consome só os hooks.

Os interceptors de `services/api.js` cuidam de: injeção do bearer token (`useAuthStore`), retry de 401 via refresh token (`services/refreshToken.js`), e criação de `error.feedback` (toast automático, salvo header `silent: true`).

## Convenções inegociáveis

- **Mutations**: o consumidor dirige com `mutation.mutate(vars, { onSuccess, onError })` — callbacks por chamada (navegar, `error.feedback.dispatch()`, `setError`). O hook segura só efeitos sempre-on (invalidar cache, toast de sucesso). **Nunca `mutateAsync` + try/catch** (racing) — inegociável; encadeie no `onSuccess`.
- **Query keys** sempre no enum `queries/@config.js` — nunca string solta inline.
- **API só via controller** — nada de `api.*`/axios em componente/tela/hook que não seja query/mutation.
- **Validação** nos schemas zod (`@/zodSchemes` ou junto da feature). Mensagens são **strings pt-BR** — mantenha o padrão do repo.
- **Erro de API**: normalmente o interceptor já dispara o toast; no `onError` use `error.feedback?.dispatch()` (ou trate status específico). Para suprimir o toast automático, mande header `silent: true` no controller.
- **UI**: reutilize as primitivas de `@/components/ui/*`; não recrie. Estilo com `styled-components/native` + tokens do `theme`. Ícones via `lucide-react-native`.
- **Navegação**: expo-router (`router.push/replace`, `<Link href>`, `useLocalSearchParams`) — tela nova = arquivo em `src/app/...`.
- **Config/env**: `process.env.EXPO_PUBLIC_*` (ex.: `EXPO_PUBLIC_API_BASE_URL`).
- **Chaves de storage persistido**: `@giftpay-family/<nome>`.

## Testes

Jest (preset `jest-expo`). **Teste a lógica, não o render**: schema via `safeParse`, actions de store chamadas direto, hooks via `renderHook` (mocke só a fronteira `@/services/api`), utils/validators chamados direto. Renderize um componente só quando o comportamento genuinamente mora nele. Use o `createTestQueryClient()` de `@/test/queryClient` para hooks react-query (nunca `new QueryClient()` inline). Cubra toda lógica nova/tocada; 80% de cobertura é alvo aspiracional. Detalhe na skill **`tdd`**.

## Mais detalhe

- **skill `project-architecture`** — onde mora cada coisa + esqueletos por camada + receita de implementação.
- **skills `plan-prd` / `tdd` / `grill-me`** — planejamento (PRD), implementação test-first e entrevista de clarificação.
- **skill `code-review`** — revisão sênior das mudanças de git.
