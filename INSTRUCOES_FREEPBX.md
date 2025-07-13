# 🔧 Instruções para Configurar Mensagens no FreePBX

## 📋 Problema Identificado
O contexto `textmessages` não está sendo usado para mensagens. As mensagens estão sendo processadas como chamadas no contexto `from-internal`.

## ✅ Solução

### **Passo 1: Copiar Arquivo**
```bash
sudo cp config/extensions_custom.conf /etc/asterisk/
```

### **Passo 2: Editar extensions.conf do FreePBX**
```bash
sudo nano /etc/asterisk/extensions.conf
```

**Adicione no FINAL do arquivo:**
```ini
; Incluir configurações customizadas
#include extensions_custom.conf

; Incluir contexto customizado no from-internal
[from-internal]
include => from-internal-additional
include => from-internal-custom
```

### **Passo 3: Verificar PJSIP**
Certifique-se que os endpoints têm `message_context=textmessages`:

```bash
sudo nano /etc/asterisk/pjsip.conf
```

**Procure pelos seus endpoints e adicione:**
```ini
[1000]
type=endpoint
; ... outras configurações ...
message_context=textmessages
subscribe_context=subscriptions

[1004] 
type=endpoint
; ... outras configurações ...
message_context=textmessages
subscribe_context=subscriptions
```

### **Passo 4: Recarregar Configurações**
```bash
sudo asterisk -rx "dialplan reload"
sudo asterisk -rx "pjsip reload"
```

### **Passo 5: Verificar Configuração**
```bash
# Verificar se o contexto foi carregado
sudo asterisk -rx "dialplan show textmessages"

# Verificar endpoints
sudo asterisk -rx "pjsip show endpoints"

# Verificar configuração específica
sudo asterisk -rx "pjsip show endpoint 1000" | grep message
```

## 🧪 Testes

### **Teste 1: Via Chamada (extensão 999)**
- Disque 999 de qualquer ramal
- Deve enviar mensagem de teste
- Deve tocar um beep

### **Teste 2: Via CLI do Asterisk**
```bash
sudo asterisk -rx "message send to pjsip:1000 from pjsip:1004 body 'Teste CLI'"
```

### **Teste 3: Via Browser Phone**
- Envie mensagem pelo interface web
- Deve aparecer no contexto `textmessages` nos logs

## 📝 Logs Esperados

### **Para Mensagens (correto):**
```
-- Executing [1000@textmessages:1] NoOp("Message/ast_msg_queue", "=== MENSAGEM SIP RECEBIDA ===")
```

### **Para Chamadas de Teste:**
```
-- Executing [999@from-internal:1] NoOp("PJSIP/1004-00000033", "=== TESTE DE MENSAGEM VIA CHAMADA ===")
```

## 🔍 Troubleshooting

### **Se mensagens ainda vão para from-internal:**
1. Verificar se `message_context=textmessages` está nos endpoints
2. Recarregar PJSIP: `pjsip reload`
3. Verificar logs: `tail -f /var/log/asterisk/messages`

### **Se contexto não é encontrado:**
1. Verificar se `#include extensions_custom.conf` foi adicionado
2. Recarregar dialplan: `dialplan reload`
3. Verificar sintaxe: `dialplan show textmessages`

## ✅ Resultado Final
- ✅ Mensagens processadas no contexto `textmessages` 
- ✅ Chamadas de teste funcionando (999, 998, 997)
- ✅ Logs limpos e informativos
- ✅ Compatível com FreePBX 