---
name: code-review
description: "Revisão de código sênior das mudanças atuais do git no giftpay-family (React Native + Expo). Detecta riscos de segurança no cliente, problemas de performance (re-renders, listas, efeitos), e violações das convenções de arquitetura do projeto (camadas controller/query/mutation, mutate()+callbacks, query keys no enum, zod, components/ui, styled-components, alias @/, expo-router). Propõe melhorias acionáveis. Use sempre ao revisar este projeto."
---

# Code Review Expert (giftpay-family — React Native + Expo)

## Visão geral

Faça uma revisão estruturada das mudanças atuais do git neste app React Native + Expo (**JavaScript**; versões exatas no `package.json`). Foco em **arquitetura/convenções**, **performance de UI** (re-renders, listas, efeitos), **segurança no cliente** e **qualidade de código**. Por padrão a saída é **só revisão** — não implemente correções até o usuário confirmar.

As convenções desta app estão no `AGENTS.md` e na skill **`project-architecture`** (regra das três camadas `controller → query/mutation → tela`, mutations via `mutate()`+callbacks, query keys no enum global, validação zod, primitivas `components/ui/*`, styled-components, alias `@/`, expo-router).

## Níveis de severidade

| Nível | Nome | Descrição | Ação |
|-------|------|-----------|------|
| **P0** | Crítico | Falha de segurança, crash garantido, perda de dado do usuário | Bloqueia o merge |
| **P1** | Alto | Erro de lógica, regressão de performance, `mutateAsync`+try/catch, vazamento de listener/memória, quebra de fluxo | Corrigir antes do merge |
| **P2** | Médio | Code smell, violação de convenção, texto fora do padrão | Corrigir neste PR ou follow-up |
| **P3** | Baixo | Estilo, nomes, lint, sugestão menor | Melhoria opcional |

## Workflow

### 0) Contexto da tarefa

Pergunte: "Existe tarefa/ticket relacionado a este PR?" Use como baseline.

### 1) Preflight — escopo da mudança

- `git status -sb`, `git diff --stat` e `git diff` para escopar.
- Identifique a camada de cada mudança: controller / query / mutation / store / schema / componente / tela / rota.
- Pontos críticos: auth/token (`services/refreshToken.js`, interceptors `services/api.js`), câmera/permissões (`expo-camera`).

### 2) Arquitetura & convenções

- **Três camadas**: componente **nunca** chama `api`/axios direto — passa por `controller → query/mutation`.
- **Controller** retorna a forma axios; re-exportado com namespace em `controller/index.js`.
- **Query keys** são constantes em `queries/@config.js` — nunca string inline; key com argumento → array.
- **Mutations**: consumidas via `mutate(vars, {onSuccess, onError})`. **NUNCA `mutateAsync` + try/catch** — inegociável.
- **Validação** em zod; mensagens pt-BR; predicados em `@/sdk/validator`.
- **UI**: reusar primitivas de `components/ui/*`, não recriar; styled-components + tokens do `theme`; ícones lucide.
- **Navegação** por expo-router.
- **Imports por alias `@/`**, nunca `../../`.

### 3) Candidatos a remoção

Código morto/redundante: telas/rotas órfãs, controller fns sem uso, query keys órfãs, campos de store nunca lidos.

### 4) Segurança & confiabilidade

- Segredos hardcoded / `.env` commitado
- PII/token em `console.log` ou storage desnecessário
- `route.params`/deep link sem validação
- Lógica de refresh 401 (`services/refreshToken.js`) quebrada
- Permissões nativas além do necessário

### 5) Qualidade & performance

- Tratamento de erro (promise solta, `catch` vazio, `error.feedback` ignorado)
- Re-render (memo/useMemo/useCallback, props inline, `value` de Context não memoizado)
- Listas (`FlatList` sem `keyExtractor`/index como key, `ScrollView` em lista longa)
- `useEffect` (deps, cleanup de listener/timer)
- react-query (`queryKey` sem variáveis, `enabled` faltando)
- Boundary (`cond && ''`/`0` fora de `<Text>`)

### 6) Testes

- Comportamento novo/alterado deve ter teste.
- **Teste a lógica, não a renderização**: schema via `safeParse`, store action direto, hook via `renderHook` (mock só `@/services/api`).
- Use `createTestQueryClient()` de `@/test/queryClient` (nunca `new QueryClient()` inline).

### 7) Formato de saída

**OBRIGATÓRIO — sempre grave a revisão num arquivo markdown** antes de apresentar no chat.

- **Local:** `docs/reviews/`
- **Nome:** `<TICKET>-PR<NUMERO>-review.md` ou `<branch-ou-slug>-review.md`.

```markdown
## Resumo da Revisão

**Arquivos revisados**: X arquivos, Y linhas
**Camadas tocadas**: controller / query / mutation / store / schema / tela / rota
**Avaliação geral**: [APROVAR / PEDIR_MUDANÇAS / COMENTAR]

---

## Findings

### P0 - Crítico
(nenhum ou lista)

### P1 - Alto
1. **[arquivo:linha]** Título curto
  - Descrição do problema
  - Correção sugerida

### P2 - Médio
### P3 - Baixo

---

## Plano de remoção/iteração
## Sugestões adicionais
```

### 8) Confirmação de próximos passos

```markdown
## Próximos passos

Encontrei X problemas (P0: _, P1: _, P2: _, P3: _).

1. **Corrigir tudo**  2. **Só P0/P1**  3. **Itens específicos**  4. **Nenhuma mudança**
```

**Importante**: NÃO implemente nada até o usuário confirmar. Ao corrigir, siga a skill **tdd** (teste primeiro).

## Skills relacionadas

- **project-architecture** — convenções de onde mora cada coisa
- **tdd** — ciclo de implementação RED → GREEN → REFACTOR
