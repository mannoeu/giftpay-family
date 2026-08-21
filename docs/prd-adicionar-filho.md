# PRD — Adicionar filho

## 1. Contexto

A home já lista dependentes via `useDependentsQuery` → `DependentController.getDependents()` (mock em memória, delay 1,5s). O botão **Adicionar** em [`src/screenComponents/home/Dependents/index.jsx`](src/screenComponents/home/Dependents/index.jsx) é stub (`onPress={() => {}}`).

Já existem: bottom sheets (`useSheet` + `SheetRoot`), `UserAvatar` com anel de seleção, `nameScheme`, Input com `insideBottomSheet`, máscara via `vanilla-masker`, e o padrão de mutation `mutate()` + callbacks. Não existem: create de dependente, date picker, schema de nascimento para criança (`birthDateSchema` exige ≥16 anos), ilustração de sucesso, nem modal de confirmação além de sheet/toast/`Alert`.

## 2. Objetivo

Permitir que o responsável cadastre um filho pela home, com UI alinhada ao Figma (form vazio / preenchido / sucesso), dados fluindo por controller → react-query, e o novo filho aparecendo na row ao concluir — tudo mockado, com a mutation já no contrato que o backend vai ocupar.

## 3. Decisões assumidas

1. Idade: data real `DD/MM/YYYY`, **não futura**, **sem teto de idade**. Não reutilizar `birthDateSchema` (≥16). Novo `childBirthDateSchema`. [confirmado]
2. Perfil fora deste PR. [confirmado]
3. Sucesso mantém os dois botões do Figma; **os dois só fecham o sheet**. [confirmado]
4. Ilustração de sucesso: [`src/assets/images/free-1-free-human-emotion-illustrations-pack 1.svg`](src/assets/images/free-1-free-human-emotion-illustrations-pack%201.svg). [confirmado]
5. Data: Input mascarado `99/99/9999`, teclado numérico, sem lib nova. [confirmado]
6. Contrato mock: `POST /main/dependents` (path reservado); body `{ name, birthDate: "YYYY-MM-DD", color }`; 201 `{ id, name, color, birthDate }`. Array em memória recebe `push`; home atualiza via cache. [confirmado]
7. Um único bottom sheet com `step: "form" | "success"` (padrão do `PermissionPromptSheet`). [confirmado]
8. `Cadastrar` desabilitado enquanto o form for inválido (`isValid`) ou `isPending` — Figma. [suposição alinhada ao Figma]
9. Paleta do picker (5 cores do Figma/DS): `#7A64C8`, `#C06990`, `#56A263`, `#557FEA`, `#BEAC48`. Default: a primeira. Com nome, a inicial aparece em **todos** os círculos. Anel de seleção: o teal já usado em `UserAvatar`. [suposição técnica]
10. Sem `ToastSuccess` — o sheet de sucesso é o feedback. Sem toast extra. [suposição técnica]
11. Copy das carteiras é só informativo; **não** criar carteiras por filho no mock (saldo família não muda). [suposição técnica]
12. `birthDateSchema` adulto permanece intacto. [suposição técnica]

## 4. Escopo / Fora de escopo

**No escopo:**

- Schema + formatter de data + paleta de avatares
- `DependentController.createDependent` mock (mesma forma `{ data }` do axios)
- Mutation `createDependent` + invalidação/`setQueryData` de `QueryKeys.getDependents`
- Sheet `AddDependentSheet` (form + sucesso) aberto pelo `UserAvatarAdd`
- Novo filho visível na row da home após sucesso

**Fora de escopo (YAGNI):**

- Tela de perfil, vincular cartão, recarga
- DateTimePicker nativo, upload de foto, limite de filhos
- Axios real / feature flag mock↔API (a troca futura é só o corpo do controller)
- Alterar `getFamilyWallet` ou a tela `dependent/[id]`

## 5. Estado & camada de dados

- **Schemas zod** (novos/alterados): `childBirthDateSchema()` em `@/zodSchemes`; `addDependentFormScheme` em `@/zodSchemes/addDependent` (`name` + `birthDate` + `color` enum das 5 cores).
- **Controllers**: `createDependent({ data })` em `controller/dependent.controller.js`. Array mutável + `resetMockDependents()` para testes. IDs = `max(id)+1`. Delay 1,5s como os GETs.
- **Hooks react-query**: `createDependent()` em `mutations/createDependent.js`. `mutationFn` desembrulha `.data`.
- **Query keys**: nenhuma nova — reutiliza `QueryKeys.getDependents`.
- **Stores zustand / Context**: nenhum zustand novo. `step` e nome criado são estado local do sheet.
- **Invalidação/refetch de cache**: `setQueryData` (append se o id ainda não está na lista) + `invalidateQueries([QueryKeys.getDependents])`.

Quando o backend existir, o controller vira `api.post("/main/dependents", data)` e o resto permanece.

## 6. Contrato de API & Hooks

- **Endpoint:** `POST /main/dependents`
- **Auth/permissão:** mesma sessão privada da home (mock ignora token)
- **Request (zod / shape):** `{ name: string, birthDate: "YYYY-MM-DD", color: "#RRGGBB" }`
- **Response (shape):** `{ id: number, name, color, birthDate }`
- **Status & erros:** runtime mock sempre resolve (forma `{ data }`). Testes rejeitam a Promise para `onError`. Quando for axios: interceptor dispara toast; o sheet chama `error.feedback?.dispatch()` no `onError` da chamada.
- **Controller:** `createDependent` em `controller/dependent.controller.js`
- **Hook react-query:** `createDependent` em `mutations/createDependent.js`
- **Query key (enum):** `QueryKeys.getDependents` (invalidada)

Consumo no sheet (callbacks na chamada, nunca `mutateAsync`):

```js
mutate(
  { data: { name: values.name.trim(), birthDate: birthDateToIso(values.birthDate), color: values.color } },
  {
    onSuccess: (dependent) => { setCreatedName(dependent.name); setStep("success"); },
    onError: (error) => { error.feedback?.dispatch(); },
  },
);
```

## 7. Compatibilidade de plataformas (Android/iOS)

- Permissões / APIs nativas: nenhuma nova.
- Teclado, SafeArea/insets, back button Android: Inputs com `insideBottomSheet`. `SheetRoot` já tem `keyboardBehavior="interactive"`, `android_keyboardInputMode="adjustPan"` e padding de `insets.bottom`. Back do Android: dismiss do `BottomSheetModal` → `closeSheet` (já no `onDismiss`).
- Diferenças de comportamento Android vs iOS: iguais (máscara de texto, sem picker nativo). Datas em calendário local (`new Date(y, m-1, d)`), sem UTC. Comparar futuro com a data de hoje zerada (`setHours(0,0,0,0)`).

## 8. Textos (pt-BR)

| Onde (schema/toast/label) | Texto pt-BR |
| ------------------------- | ----------- |
| Título form | Novo filho |
| Label avatares | Escolha um avatar |
| Placeholder nome | Nome |
| Placeholder data | Data de nascimento |
| Helper carteiras | As carteiras de Lanche e Mesada são criadas automaticamente com saldo zero. Você poderá vincular um cartão depois. |
| CTA form | Cadastrar |
| Sucesso título | Bem vindo à família, {nome}! |
| Sucesso corpo | Agora você precisa vincular um cartão físico e fazer uma recarga para que {nome} comece a usar o app. |
| CTA sucesso secundário | Agora não |
| CTA sucesso primário | Ver Perfil |
| Schema data vazia | Campo obrigatório |
| Schema data malformada | Data inválida |
| Schema data inexistente | A data informada não existe |
| Schema data futura | A data não pode ser no futuro |

## 9. Cenários de teste

### Happy paths

- **childBirthDateSchema válido** — Dado `23/05/2014`, Quando `safeParse`, Então `success: true`.
- **addDependentFormScheme válido** — Dado nome `José`, data válida e uma cor da paleta, Quando `safeParse`, Então `success: true`.
- **Formatter.birthDate** — Dado `23052014`, Quando formatar, Então `23/05/2014`.
- **birthDateToIso** — Dado `23/05/2014`, Quando converter, Então `2014-05-23`.
- **createDependent controller** — Dado o mock resetado, Quando `createDependent({ data })`, Então resolve `{ data: { id, name, color, birthDate } }` e `getDependents` inclui o novo item.
- **mutation sucesso** — Dado controller mock resolvendo o dependente, Quando `mutate({ data })`, Então `onSuccess` do hook atualiza o cache de `getDependents` (lista contém o criado) e o callback da chamada recebe o objeto desembrulhado.

### Error cases

- **Nome vazio / curto / com número** — mensagens pt-BR de `nameScheme`.
- **Data vazia** — `Campo obrigatório`.
- **Data malformada** (`31/02/2014`, `99/99/9999`, `abc`) — `Data inválida` ou `A data informada não existe`.
- **Data futura** — `A data não pode ser no futuro`.
- **Cor fora da paleta** — `safeParse` falha.
- **Mutation erro** — Dado controller rejeitando, Quando `mutate`, Então `isError`, callback `onError` dispara, cache de `getDependents` **não** ganha item novo.

### Edge cases

- **Hoje** — data de hoje (local, meia-noite) é válida.
- **Nome com acento** — `José` válido; espaços nas pontas falham (`nameScheme`).
- **Idade ≥16 / ≥18** — continua válido (sem teto).
- **Ano 1900** — data real no passado é válida.
- **Dois creates** — IDs incrementam; os dois aparecem em `getDependents`.
- **setQueryData idempotente** — se o id já está na lista, não duplica.
- **resetMockDependents** — após create, reset restaura os 5 originais.

## 10. Passos de implementação

### Passo 0 — PRD em disco

- **Objetivo:** gravar este documento.
- **Arquivos:** `docs/prd-adicionar-filho.md`

### Passo 1 — Formatter e data ISO

- **Objetivo:** máscara `DD/MM/YYYY`, conversão ISO e paleta de avatares.
- **Arquivos:** `src/sdk/formatter/index.js`, `src/sdk/dependent/index.js`
- **RED (testes):** Formatter.birthDate, birthDateToIso, AVATAR_COLORS
- **GREEN:** implementação mínima
- **Verificar:** `npx jest src/sdk/formatter/test.js src/sdk/dependent/test.js`

### Passo 2 — Schemas zod

- **Objetivo:** `childBirthDateSchema` + `addDependentFormScheme`; adulto intacto.
- **Arquivos:** `src/zodSchemes/index.js`, `src/zodSchemes/addDependent.js`
- **RED (testes):** cenários happy/error/edge da seção 9
- **Verificar:** `npx jest src/zodSchemes`

### Passo 3 — Controller mock

- **Objetivo:** `createDependent` no array em memória.
- **Arquivos:** `src/controller/dependent.controller.js`
- **RED (testes):** create, getDependents inclui o novo, dois creates, reset
- **Verificar:** `npx jest src/controller/dependent.controller.test.js`

### Passo 4 — Mutation react-query

- **Objetivo:** unwrap data, setQueryData + invalidate, callbacks no `mutate()`.
- **Arquivos:** `src/mutations/createDependent.js`
- **Verificar:** `npx jest src/mutations/createDependent.test.jsx`

### Passo 5 — Lógica do sheet

- **Objetivo:** payload do form e abertura pelo `UserAvatarAdd`.
- **Arquivos:** `src/screenComponents/home/AddDependentSheet/`, `src/screenComponents/home/Dependents/index.jsx`

### Passo 6 — UI

- **Objetivo:** form + sucesso alinhados ao Figma, ilustração do SVG fornecido.
- **Verificar:** suíte Jest inteira verde (`npm run test:ci`)

### Passo final — Suíte verde

- **Verificar:** suíte Jest inteira verde (`npm run test:ci`).

## 11. Riscos & rollback

- **Risco:** mock em memória vaza entre testes. **Mitigação:** `resetMockDependents` no `afterEach`.
- **Risco:** `staleTime: Infinity` atrasaria a row se só invalidasse. **Mitigação:** `setQueryData` imediato + invalidate.
- **Rollback:** reverter o PR; a home volta ao stub do `UserAvatarAdd`.

## 12. Questões em aberto

- Copy exata do helper e do corpo de sucesso — usei o sentido do Figma; ajustar se o texto do frame for diferente.

---

## Auto-revisão por IA

- Faz sentido / resolve o objetivo? Sim — cadastro mockado, lista atualiza, UI nas 3 telas do Figma, mutation pronta para axios.
- Adere à skill plan-prd (seções obrigatórias presentes e não-vazias)? Sim.
- Adere à estrutura do projeto (controllers, query keys no enum, hooks react-query, zod, zustand/Context, mutations via mutate()+callbacks, components/ui, textos pt-BR, expo-router, alias @/)? Sim.
- Android/iOS tratados? Sim.
- Passos de implementação TDD-ordenados e verificáveis? Sim.
- **Ajustes feitos após a revisão:** ilustração apontada para o SVG já no repo; `setQueryData` além de invalidate; `resetMockDependents` explícito; não criar query key nova.
