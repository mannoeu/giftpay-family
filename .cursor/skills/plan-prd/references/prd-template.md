# Template de PRD — giftpay-family

Copie a estrutura para `docs/prd-<nome-feature-em-kebab>.md`. Apague os comentários `<!-- ... -->`.

---

# PRD — <Nome da feature>

## 1. Contexto

<!-- Estado atual. O que já existe hoje. Qual dor/limitação motiva a mudança. -->

## 2. Objetivo

<!-- Um parágrafo enxuto: o que muda e por quê. -->

## 3. Decisões assumidas

<!-- Numere cada decisão fechada no grill-me. Marque [confirmado pelo solicitante] ou [suposição técnica]. -->

1.
2.

## 4. Escopo / Fora de escopo

**No escopo:**

**Fora de escopo (YAGNI):**

## 5. Estado & camada de dados

<!-- Preencha só o que se aplica. -->

- **Schemas zod** (novos/alterados): nome, campos, onde fica (`@/zodSchemes` ou junto da feature).
- **Controllers** (chamadas de API): método, `controller/<dominio>.controller.js`.
- **Hooks react-query** (queries/mutations): nome, local, o que retorna.
- **Query keys** (enum `queries/@config.js`): entradas novas.
- **Stores zustand / Context**: estado afetado, actions.
- **Invalidação/refetch de cache**: o que invalida o quê após mutations.

## 6. Contrato de API & Hooks

<!-- Só se toca a camada de dados/API. -->

- **Endpoint:** `MÉTODO /caminho`
- **Auth/permissão:**
- **Request (zod / shape):**
- **Response (shape):**
- **Status & erros:** 200/4xx/... → como cada um é mapeado
- **Controller:** `nome` em `controller/<dominio>.controller.js`
- **Hook react-query:** `useXyz` em `queries|mutations/<dominio>.js`
- **Query key (enum):** `QueryKeys.xyz`

## 7. Compatibilidade de plataformas (Android/iOS) _(obrigatória)_

<!-- App full mobile — sem web. -->

- Permissões / APIs nativas (`expo-camera`, `expo-network`, …):
- Teclado, SafeArea/insets, back button Android:
- Diferenças de comportamento Android vs iOS:

## 8. Textos (pt-BR)

<!-- Liste os textos hardcoded novos (padrão pt-BR do repo). -->

| Onde (schema/toast/label) | Texto pt-BR |
| ------------------------- | ----------- |

## 9. Cenários de teste

<!-- Só se toca lógica/API. Dado/Quando/Então sobre a LÓGICA — não sobre renderização. -->

### Happy paths

- **Dado** … **Quando** … **Então** …

### Error cases

- **Dado** … **Quando** … **Então** …

### Edge cases

- **Dado** … **Quando** … **Então** …

## 10. Passos de implementação _(a seção mais importante)_

<!-- TDD-ordenado, dependência primeiro, UI por último. -->

### Passo 1 — <objetivo>

- **Objetivo:**
- **Depende de:** —
- **Arquivos:** `caminho/real.js`
- **RED (testes):** mapeie aos cenários da seção 9
- **GREEN (código mínimo):** schema zod / controller `nome` / hook `useXyz` / action de store
- **Efeitos colaterais:** invalidação de cache, navegação expo-router, toast, etc.
- **Verificar:** `npx jest <arquivo>`

<!-- Ordem sugerida: schema zod → controller → hook react-query (+ query key no enum) → store zustand/Context (se houver) → lógica do componente (form/handlers) → montagem da UI com components/ui/*. -->

### Passo final — Suíte verde

- **Verificar:** suíte Jest inteira verde (`npm test`).

## 11. Riscos & rollback

- **Risco:** … **Mitigação:** …
- **Rollback:** como reverter com segurança.

## 12. Questões em aberto

<!-- O que o grill-me não fechou. Nunca assuma em silêncio. -->

---

## Auto-revisão por IA

- Faz sentido / resolve o objetivo?
- Adere à skill plan-prd (seções obrigatórias presentes e não-vazias)?
- Adere à estrutura do projeto (controllers, query keys no enum, hooks react-query, zod, zustand/Context, mutations via mutate()+callbacks, components/ui, textos pt-BR, expo-router, alias @/)?
- Android/iOS tratados?
- Passos de implementação TDD-ordenados e verificáveis?
- **Ajustes feitos após a revisão:**
