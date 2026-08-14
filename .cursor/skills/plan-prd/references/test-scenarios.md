# Cenários de teste — giftpay-family (sobre a lógica)

Quando um PRD toca **lógica** (hook react-query, controller, store zustand, schema zod, handler/regra de componente) ou **API**, a seção **Cenários de teste** DEVE cobrir os três baldes abaixo. Escreva cada um como **Dado / Quando / Então**. São cenários no papel — viram os testes RED durante a implementação TDD (ver skill `tdd`). Não implemente no plan mode.

**Teste a lógica, não a renderização.** Mock só a fronteira `@/services/api`:

- **Schema zod** → `safeParse(...)`, asserta `success` e a **mensagem pt-BR** (`result.error.issues`).
- **Controller** → `jest.mock("@/services/api")`, asserta o shape da chamada (`api.get/post` com URL+body) e o passthrough do `data`.
- **Query/Mutation** → `renderHook` dentro de `QueryClientProvider` com `createTestQueryClient()` (`@/test/queryClient`); asserta `result.current.data`/`isError`/`isReady` e os callbacks (`onSuccess`/`onError`).
- **Store zustand** → chame a action direto (`useFooStore.getState().acao()`) e asserta o novo estado; `reset()` no fim.

## Formato

```markdown
### Happy paths
- **<nome>** — Dado <estado/fixtures>, Quando <ação/chamada>, Então <retorno + estado + efeitos>.

### Error cases
- **<nome>** — Dado <estado>, Quando <entrada inválida/erro de API>, Então <estado de erro, sem efeito colateral>.

### Edge cases
- **<nome>** — Dado <estado limítrofe>, Quando <ação>, Então <tratamento esperado>.
```

## Checklist de cobertura

### Happy paths (pelo menos um de cada que se aplique)
- [ ] Schema: entrada válida → `success: true`
- [ ] Controller: chama `api.<método>` com URL/headers/body certos e devolve `{data}`
- [ ] Query: `data` desembrulhado/reformatado corretamente (com fallbacks)
- [ ] Mutation de sucesso: `mutationFn` monta o payload certo; `onSuccess` invalida as **query keys** corretas (do enum) e chama o callback do `mutate()`
- [ ] Store: action transiciona o estado como esperado
- [ ] Handler de form: submit válido chama `mutate()` com os vars certos

### Error cases
- [ ] Schema: cada campo inválido → a **mensagem pt-BR** esperada em `issues`
- [ ] Controller: rejeição propaga a forma axios (`{response:{status,data}}`)
- [ ] Query/Mutation: erro de API → `isError`/`onError`; `error.feedback` disponível; toast automático respeitado; `silent: true` quando aplicável
- [ ] Mapeamento de status: 400 (validação), 401 (refresh/sessão), 403 (permissão), 404, 500/502
- [ ] Sem efeito colateral indevido no erro (não invalida cache, não navega)
- [ ] Offline / sem rede → `createOfflineFeedback` / estado definido

### Edge cases
- [ ] Strings vazias / só espaço / acento e emoji (pt-BR), limites de tamanho
- [ ] Valores limítrofes (0, saldo mínimo/máximo, listas grandes)
- [ ] Submissão duplicada / reenvio (idempotência; não dispara mutation duas vezes)
- [ ] Loading/`isFetching`, refetch e cache **stale**; `enabled` condicional
- [ ] Permissão de SO negada (câmera, network) → fallback
- [ ] Data/hora, timezone e locale (pt-BR)

## Mapeando para o TDD

```
cenário do PRD  →  teste RED (veja falhar)  →  código GREEN mínimo  →  REFACTOR
```

Depois que todos os cenários passam, rode a **suíte Jest inteira** (`npm test`) pra confirmar que nada regrediu.

## Anti-padrões

- Listar só happy paths — error e edge são obrigatórios.
- Assertar num **mock** em vez do efeito real (estado do store, `data` do hook, payload do controller).
- Cenário que testa o framework (react-query/zod por dentro) em vez do contrato da feature.
- Cenário de "renderizou o componente" quando a lógica podia ser testada isolada.
