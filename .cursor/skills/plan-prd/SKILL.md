---
name: plan-prd
description: Complementa o plan mode. Toda sessão em plan mode DEVE produzir um Product Requirements Document (PRD) antes de qualquer código, rodar grill-me para clarear a ideia, definir cenários de teste sobre a lógica (quando houver lógica/integração com API) e, ao final, passar por uma auto-revisão por IA do plano. Nenhum código de produção é escrito até o usuário aprovar explicitamente o PRD. Use sempre que o plan mode estiver ativo no giftpay-family (React Native + Expo).
---

# Plan Mode → PRD (giftpay-family)

## Visão geral

Plan mode existe para **decidir o que construir e provar no papel que está certo** — nunca para escrever código de produção. Esta skill transforma cada sessão de plan mode num fluxo com portões:

```
grill-me  →  PRD  →  (toca lógica/API? → cenários de teste)  →  auto-revisão por IA  →  aprovação do usuário  →  SÓ ENTÃO código
```

**Princípio central:** nenhum código de produção existe até o usuário ter lido e aprovado explicitamente um PRD escrito.

**Stack:** React Native + Expo (expo-router). Full mobile (Android + iOS) — **sem web**. Estado de servidor com **react-query**; chamadas HTTP isoladas em **controllers**; query keys nomeadas no **enum global** (`queries/@config.js`); formulários com **react-hook-form** + validação **zod** (mensagens pt-BR); estado de feature/UI em **zustand**; wizard multi-step em **Context API**; estilo com **styled-components/native**; tokens de cor por nome visual (`teal`, `mint`, `cream`, `charcoal`, etc.); UI montada com as primitivas próprias de **`components/ui/*`** (Input, InputPassword, Button, Checkbox, CodeInput, Text); ícones **lucide**; navegação **expo-router**; fontes **Outfit**. Onde a convenção não estiver clara, siga o vizinho mais próximo. Detalhe da arquitetura na skill **project-architecture**.

## A Lei de Ferro

```
PLAN MODE = SEM CÓDIGO DE PRODUÇÃO. ESCREVA O PRD PRIMEIRO. ESPERE A APROVAÇÃO.
```

Durante o plan mode você PODE: ler/grep/glob a base de código; rodar comandos somente-leitura; escrever o PRD (`docs/prd-*.md`) e notas.

Durante o plan mode você NÃO PODE: criar/editar código de produção; rodar qualquer coisa que mute estado.

## Fluxo

### Passo 1 — Grelhe a ideia (OBRIGATÓRIO)

Invoque a skill **grill-me**. Entreviste o usuário sem dó, uma pergunta por vez, percorrendo cada ramo da árvore de decisão e oferecendo sua recomendação. Qualquer coisa respondível lendo o código → leia o código.

### Passo 2 — Escreva o PRD (OBRIGATÓRIO, antes de qualquer código)

Produza `docs/prd-<nome-feature-em-kebab>.md`. Use o template em @references/prd-template.md. Seções obrigatórias:

1. **Contexto** — estado atual, o que já existe hoje
2. **Objetivo** — o que muda e por quê, um parágrafo enxuto
3. **Decisões assumidas** — toda decisão fechada no grill-me, numerada
4. **Escopo / Fora de escopo** — fronteiras explícitas (YAGNI)
5. **Estado & camada de dados** — schemas zod; stores zustand/Context; hooks react-query; entradas novas no enum de query keys; controllers; estratégia de invalidação
6. **Contrato de API & Hooks** (se toca dados/API) — endpoint(s), shape, controller, hook, query key
7. **Compatibilidade de plataformas (Android/iOS)** (OBRIGATÓRIA) — app full mobile. Permissões/APIs nativas (`expo-camera`, `expo-network`), teclado, SafeArea/insets, back button Android, gestos. Se algo difere entre Android e iOS, diga o comportamento de cada.
8. **Textos (pt-BR)** — liste os textos hardcoded novos
9. **Cenários de teste** (se toca lógica/API) — ver Passo 3
10. **Passos de implementação** — blueprint executável, TDD-ordenado, dependência primeiro, UI por último
11. **Riscos & rollback**
12. **Questões em aberto**

### Passo 3 — Cenários de teste (OBRIGATÓRIO quando toca lógica ou API)

Ver @references/test-scenarios.md. Cenários Dado/Quando/Então sobre a lógica — não sobre renderização.

### Passo 4 — Auto-revisão do plano por IA (OBRIGATÓRIO)

Releia o PRD e responda por escrito num bloco de **Auto-revisão**:

- O plano **faz sentido** e resolve o objetivo?
- Ele **adere a esta skill** — todas as seções obrigatórias presentes e não-vazias?
- Ele **adere à estrutura do projeto** — API em controller, query keys no enum global, hooks react-query, validação em zod, estado em zustand/Context, mutations via `mutate()`+callbacks (nunca `mutateAsync`+try/catch), UI com `components/ui/*`, textos pt-BR, navegação expo-router, alias `@/`?
- **Android/iOS** foram tratados?
- Os **passos de implementação** são TDD-ordenados, pequenos e verificáveis?

### Passo 5 — Apresente para aprovação (PORTÃO RÍGIDO)

> PRD escrito em `docs/prd-<nome>.md` e auto-revisado. Nenhum código será escrito até você aprovar.

**ESPERE.** "Pode ir", "aprovado", "implementa" = aprovação.

### Passo 6 — Implemente (somente após aprovação)

Saia do plan mode e implemente via skill **tdd** (RED → GREEN → REFACTOR), e então suíte Jest inteira verde.

## Sinais vermelhos — PARE

- Escrever/editar código de produção com o plan mode ativo
- Pular o grill-me ("já entendi")
- Mudança em lógica/API sem cenários happy/error/edge
- Chamada de API fora de um controller, ou query key fora do enum global
- Recriar uma primitiva que já existe em `components/ui/*`
- Pular a auto-revisão por IA do Passo 4
- Implementar antes do usuário dizer sim

## Skills relacionadas

- **grill-me** — a entrevista de clarificação (Passo 1)
- **tdd** — implementação test-first após aprovação (Passo 6)
- **project-architecture** — onde mora cada coisa
- **code-review** — rode após a implementação
