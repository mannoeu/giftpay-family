# Navegação, rotas e telas (giftpay-family)

O app usa **expo-router** (file-based routing): as telas vivem em `src/app/` e o navegador é derivado da estrutura de arquivos. App full mobile — **sem web**.

## Layout raiz + providers — `src/app/_layout.jsx`

O `RootLayout`:

1. Carrega fontes Outfit (`useFonts` — Light, Regular, SemiBold, Bold) e segura a splash até `appIsReady`.
2. Observa `AppState` (`focusManager` do react-query) para revalidar queries quando o app volta ao foco.
3. Monta `ThemeProvider` (styled-components, tema sempre light) → `<Providers>` → `<Stack>`.
4. **Guard de auth**: a partir de `useAuthStore().token`, redireciona: não-autenticado em `(private)` → `/(public)/login`; autenticado em `(public)` ou raiz → `/(private)/home`.

A stack de providers real fica em **`src/components/Providers.jsx`**, de fora pra dentro:

```
QueryClientProvider(queryClient) → GestureHandlerRootView → StatusBar + ToastsRoot + {children} + SheetRoot
```

- O `queryClient` da app é definido em `services/queryClient.js`. **Em teste use `createTestQueryClient()` de `@/test/queryClient`, não este.**
- `ToastsRoot` e `SheetRoot` são globais (montados uma vez).

## Grupos de rota — `src/app/`

```
src/app/
├── _layout.jsx            ← Root: ThemeProvider, auth guard, fontes Outfit
├── index.jsx              ← <Redirect href="/(public)/login" />
├── camera.jsx             ← Tela full-screen de câmera (copiada do giftpay-app)
├── (public)/
│   ├── _layout.jsx        ← Stack pública
│   ├── login.jsx
│   └── sign-up/
│       ├── _layout.jsx
│       └── index.jsx
└── (private)/
    ├── _layout.jsx        ← Tabs com TabBar custom (show/hide por rota)
    └── home/
        ├── _layout.jsx    ← Stack interno do home
        └── index.jsx
```

- Parênteses = grupo sem segmento na URL.
- `_layout.jsx` declara o navegador do nível (`Stack`/`Tabs`).
- Adicionar tela nova: criar o arquivo e, se o `_layout` lista as telas explicitamente, adicionar a `Stack.Screen`/`Tabs.Screen` correspondente.

## TabBar — show/hide por rota

O `TabBar` custom em `components/tabBar/` oculta automaticamente em rotas internas (animação com Reanimated). A lista de rotas que ocultam a TabBar está em `components/tabBar/utils.js` → `pathnamesToHideTabs`. Ao criar sub-rotas em `(private)/home/`, adicione o pathname ao array.

## Navegação — API do expo-router

**Nunca** use API de navegação de outra lib. Use:

```jsx
import { router, Link, Redirect, useLocalSearchParams, useRouter } from "expo-router";

router.push("/(private)/home");
router.replace("/(public)/login");
<Link href="/(private)/home">Início</Link>;
const { id } = useLocalSearchParams();
```

Tela nova = novo arquivo no grupo/stack certo; declare no `_layout.jsx` quando o navegador lista as telas.

## Anatomia de uma tela

- A tela é um componente default-export no arquivo de rota.
- Consome **hooks** de `@/queries`/`@/mutations` — nada de `api`/axios direto.
- Formulário: `react-hook-form` + `zodResolver`, submit chama `mutate()`.
- UI com primitivas de `@/components/ui/*` + `styled-components`; estilos de layout em `@/styles/<tela>` (`import * as S from "@/styles/<tela>"`).
- Textos em **pt-BR hardcoded**.
- Respeite safe area/insets e teclado. Considere back button do Android em fluxos com passos.
