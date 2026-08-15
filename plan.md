# Plano: Fluxo de Permissão de Notificação — giftpay-family

## Contexto

O giftpay-family já tem o SDK de push-notification e o OneSignal configurados
(mesmo App ID, mesmas dependências do giftpay-app). O que falta é:

- O modal automático de permissão na área logada
- O sheet de controle (ativar/desativar)
- O ponto de entrada no TopHeader
- Componentes UI que o flow depende

---

## 1. Componentes UI portados do giftpay-app

| Arquivo destino | O que é |
|---|---|
| `src/components/ui/radio/index.jsx` + `styles.js` | Seletor de opções com animação (usado no NotificationsSheet) |
| `src/components/ui/skeleton/index.jsx` + `styles.js` | Loading placeholder animado |
| `src/components/ui/separator.jsx` | Linha divisória horizontal/vertical |
| `src/components/infoComponent/index.jsx` + `styles.js` | Box com ícone Info/Warning/Danger |

---

## 2. Hooks criados

| Arquivo | Responsabilidade |
|---|---|
| `src/hooks/usePushNotificationPermissionPrompt.js` | Aciona o modal automático 1x por sessão quando o usuário não tem permissão ativa. Monitora `AppState` (`active`) + `useFocusEffect`. |
| `src/hooks/usePushNotificationPreference.js` | Lê status atual da permissão e expõe `setEnabled(bool)` para ativar/desativar via OneSignal. |

---

## 3. Sheets criados

| Arquivo | O que é |
|---|---|
| `src/components/sheets/permissionPromptSheet/index.jsx` + `styles.js` | Modal automático com variante `"request"` (Agora não / Permitir) e `"success"` (Notificações ativadas / Entendi). Texto genérico. |
| `src/components/sheets/notificationsSheet/index.jsx` + `styles.js` | Sheet de controle com Radio (Ativadas/Desativadas) + InfoComponent de status. |

---

## 4. Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `src/app/(private)/home/index.jsx` | Chama `usePushNotificationPermissionPrompt()` — dispara o modal automático na Home logada |
| `src/app/(private)/home/_components/TopHeader/index.jsx` | Adiciona botão `Bell` que abre `NotificationsSheet`. Só renderiza se `isPushNotificationSupported()` |

---

## 5. O que NÃO será tocado

- `src/sdk/push-notification/` — já completo no family
- `app.json` — OneSignal já configurado (mesmo App ID, plugin, iOS modes)
- `src/hooks/usePushNotificationHandlers.js` — já existe
- `src/hooks/usePushNotificationIdentitySync.js` — já existe
- `src/hooks/useFlushPendingPushNavigation.js` — já existe
- `src/app/_layout.jsx` — já chama `initPushNotificationService()`, handlers e flush

---

## Fluxo após implementação

```
App inicia
  → initPushNotificationService()                          [já existe]

Usuário loga
  → pushNotificationLogin(user.extra_data.onesignal_uuid) [já existe]

Home abre
  → usePushNotificationPermissionPrompt()                  [NOVO]
    → !permissão ativa + 1ª vez na sessão
      → abre PermissionPromptSheet (variant="request")
        → "Agora não" → fecha
        → "Permitir"  → OneSignal.requestPermission()
          → concedido → PermissionPromptSheet (variant="success")
          → negado    → Toast de erro

TopHeader
  → botão Bell (isPushNotificationSupported)               [NOVO]
    → abre NotificationsSheet
      → Radio Ativadas/Desativadas
        → setEnabled(true/false) → OneSignal optIn/optOut
```

---

## Ordem de implementação

1. `ui/separator.jsx`
2. `ui/skeleton/`
3. `ui/radio/`
4. `infoComponent/`
5. `hooks/usePushNotificationPreference.js`
6. `hooks/usePushNotificationPermissionPrompt.js`
7. `sheets/notificationsSheet/`
8. `sheets/permissionPromptSheet/`
9. `TopHeader` — botão Bell
10. `home/index.jsx` — hook do prompt
