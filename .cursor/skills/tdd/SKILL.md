---
name: tdd
description: Use ao implementar qualquer feature, bugfix ou execução de PRD no giftpay-family, antes de escrever o código de implementação.
---

# Test-Driven Development (TDD) — giftpay-family (React Native + Expo)

## Visão geral

Escreva o teste primeiro. Veja-o falhar. Escreva o mínimo de código para passar.

**Princípio central:** se você não viu o teste falhar, não sabe se ele testa a coisa certa.

**Violar a letra das regras é violar o espírito das regras.**

Stack de teste: **Jest** (preset `jest-expo`), `@testing-library/react-native` (`renderHook`, `render`, `waitFor`, `act`), schemas zod via `safeParse`, hooks react-query envolvidos em `QueryClientProvider` com `createTestQueryClient()` (`@/test/queryClient`). **Mock só a fronteira `@/services/api`** (e libs nativas quando inevitável).

**Teste a lógica, não a renderização.** Schema → `safeParse`. Action de store zustand → chame direto. Hook → `renderHook`. Util/validator/controller → chame direto. Renderize um componente **só** quando o comportamento vive mesmo nele.

## Quando usar

**Sempre:**
- Features novas (controller, query, mutation, schema, store, handler de componente)
- Correções de bug
- Refatorações
- Mudanças de comportamento

**Exceções (pergunte ao seu parceiro humano):**
- Protótipos descartáveis / spikes
- Pura montagem de UI sem lógica (estilos, layout) — ainda assim teste a lógica que houver
- Arquivos de config

Pensando "pular o TDD só desta vez"? Pare. Isso é racionalização.

## A Lei de Ferro

```
NENHUM CÓDIGO DE PRODUÇÃO SEM UM TESTE FALHANDO ANTES
```

Escreveu o código antes do teste? Apague. Comece de novo. Reimplemente a partir dos testes. Ponto.

## Red-Green-Refactor

```
RED (teste falha)  →  verifica que falha certo  →  GREEN (código mínimo)  →
verifica que passa  →  REFACTOR (limpar, segue verde)  →  SUÍTE INTEIRA (npm test)  →  próximo
```

### RED — escreva o teste que falha

Um teste mínimo mostrando o que deve acontecer. Asserta comportamento real (shape retornado, estado do store, mensagem pt-BR do erro, payload do controller).

```js
// zodSchemes/cpf.test.js
import { cpfScheme } from "@/zodSchemes";

const schema = cpfScheme();

it("reprova CPF incompleto com a mensagem certa", () => {
  const r = schema.safeParse("123");
  expect(r.success).toBe(false);
  expect(r.error.issues[0].message).toBe("CPF incompleto");
});
```

Nome claro, assert em comportamento real (a mensagem pt-BR), um comportamento só.

**Requisitos:** um comportamento; nome `it(...)` claro; código real + mock só de `@/services/api` (nunca mocke a unidade sob teste).

### Verifique o RED — veja falhar (OBRIGATÓRIO)

```bash
npx jest src/zodSchemes/cpf.test.js -t "reprova CPF incompleto"
```

Confirme: o teste **falha** (não por typo/import quebrado) e falha porque a feature falta, não porque o teste está quebrado.

**Passou de primeira?** Você está testando comportamento que já existe. Conserte o teste.

### GREEN — código mínimo

O mínimo para passar, seguindo as convenções do projeto (controller para chamada de API, hook react-query para estado de servidor, `mutate()` + callbacks, validação no schema zod com mensagem pt-BR). Não adicione features, não refatore código sem relação.

### Verifique o GREEN — veja passar (OBRIGATÓRIO)

```bash
npx jest src/zodSchemes/cpf.test.js
```

Teste falha? Conserte o **código**, não o teste.

### REFACTOR — limpar

Só depois do verde: remova duplicação, melhore nomes, extraia predicado pra `@/sdk/validator`, mova reshape pro `queryFn`, memoize/`keyExtractor` se o código verde introduziu re-render/lista cara. Mantenha verde; não adicione comportamento.

### SUÍTE INTEIRA — regressão (OBRIGATÓRIA antes de "pronto")

```bash
npm test               # jest, suíte inteira
npm test -- --coverage # com cobertura (alvo aspiracional: 80%)
```

Confirme que **todos** os testes passam, não só os que você escreveu. Feature verde com suíte vermelha **não** está pronta.

> Hooks react-query em teste: **sempre** `createTestQueryClient()` de `@/test/queryClient` (sem retry, `gcTime: Infinity`). `new QueryClient()` inline vaza o timer de GC do react-query e segura o worker do Jest ("A worker process has failed to exit gracefully").

## Bons testes

| Qualidade | Bom | Ruim |
|-----------|-----|------|
| **Mínimo** | Uma coisa. "e" no nome? Separe. | `it('valida cpf e telefone e email')` |
| **Claro** | Nome descreve o comportamento | `it('teste 1')` / `it('funciona')` |
| **Mostra intenção** | Demonstra o efeito (shape, estado, mensagem) | Esconde o que o código deveria fazer |
| **Real** | `safeParse`/`renderHook` + reshape real | Asserta num `Mock` |
| **Isolado** | Passa sozinho e na suíte | Depende de ordem/estado (resete o store) |

## Por que a ordem importa

- **"Escrevo os testes depois"** — passam de primeira; passar de primeira não prova nada. Test-first te força a ver o teste falhar.
- **"Já testei na mão no app"** — ad-hoc, sem registro, não re-roda. "Funcionou no simulador" ≠ abrangente.
- **"Apagar X horas é desperdício"** — sunk cost. Código sem teste real é dívida técnica.

## Exemplo: correção de bug

**Bug:** `Formatter.currency` não coloca "R$" quando o valor é 0.

**RED**
```js
import { Formatter } from "@/sdk/formatter";
it("formata 0 como R$ 0,00", () => {
  expect(Formatter.currency(0)).toBe("R$ 0,00");
});
```
**Verifique o RED** → `npx jest src/sdk/formatter.test.js -t "formata 0"` (vê falhar).
**GREEN** → conserte o `Formatter.currency`.
**Verifique o GREEN** → `npx jest src/sdk/formatter.test.js`.
**SUÍTE INTEIRA** → `npm test`.

## Checklist de verificação

- [ ] Toda função / hook / controller / schema / action novo tem teste
- [ ] Viu cada teste falhar antes de implementar, pelo motivo esperado
- [ ] Escreveu o mínimo de código pra passar
- [ ] Testes-alvo passam (`npx jest <arquivo>`)
- [ ] **Suíte inteira passa** (`npm test`)
- [ ] Saída limpa (sem erro, warning, `console.log`)
- [ ] Testes usam código real + mock só de `@/services/api`; hooks com `createTestQueryClient`
- [ ] Edge cases e caminhos de erro cobertos

Não consegue marcar tudo? Você pulou o TDD. Recomece.

## Quando travar

| Problema | Solução |
|----------|---------|
| Não sei como testar | Escreva a chamada desejada (`useFoo()`, `fooSchema.safeParse(...)`, `store.acao()`) e asserta o efeito primeiro. |
| Teste complicado demais | Design complicado demais. Separe schema vs controller vs hook vs componente. |
| Preciso mockar tudo | Código acoplado demais. Mock só `@/services/api`; injete dependências. |
| Render exige muitos providers | Provavelmente é lógica testável isolada (hook/schema/store). |

## Anti-padrões de teste

- Testar o comportamento do mock em vez do comportamento real
- Adicionar métodos só-de-teste em código de produção
- Mockar sem entender as dependências (interceptor, `error.feedback`, toast, navegação, efeitos)

## Regra final

```
Código de produção → teste existe e falhou primeiro
Feature completa   → suíte inteira (npm test) verde
Caso contrário     → não é TDD
```

Sem exceção sem a permissão do seu parceiro humano.
