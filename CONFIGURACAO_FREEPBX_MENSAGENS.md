# 📱 Configuração de Mensagens SIP no FreePBX

## 🎯 Problema Identificado

O FreePBX estava processando mensagens SIP como se fossem chamadas telefônicas, causando erros no dialplan. As mensagens estavam sendo direcionadas para o contexto de chamadas em vez do contexto de mensagens.

## ✅ Solução Implementada

### 1. **Configuração do PJSIP**
Já configurado no arquivo `config/pjsip.conf`:
```ini
message_context=textmessages
subscribe_context=subscriptions
```

### 2. **Contexto de Mensagens**
Criado o contexto `[textmessages]` em `config/extensions_custom.conf` que:
- Processa mensagens SIP corretamente
- Extrai remetente e destinatário
- Verifica se o destinatário está disponível  
- Encaminha a mensagem usando `MessageSend()`

## 🔧 Passos para Configurar no FreePBX

### **Passo 1: Copiar Arquivos de Configuração**

```bash
# Copiar para o diretório do FreePBX
sudo cp config/extensions_custom.conf /etc/asterisk/
sudo cp config/pjsip.conf /etc/asterisk/pjsip_additional.conf
```

### **Passo 2: Incluir Configuração Customizada**

Edite o arquivo principal do FreePBX:
```bash
sudo nano /etc/asterisk/extensions.conf
```

Adicione no final do arquivo:
```ini
#include extensions_custom.conf
```

### **Passo 3: Configurar Usuários WebRTC**

Via interface web do FreePBX ou editando `/etc/asterisk/pjsip.conf`:

```ini
; Exemplo de usuário WebRTC
[1000](basic_endpoint,webrtc_endpoint)
type=endpoint
callerid=Usuario 1000 <1000>
auth=auth_1000
aors=aor_1000
message_context=textmessages
subscribe_context=subscriptions

[auth_1000](userpass_auth)
type=auth
username=1000
password=sua_senha_aqui

[aor_1000](single_aor)
type=aor
```

### **Passo 4: Configurar Templates WebRTC**

Adicione os templates no `pjsip.conf`:

```ini
[basic_endpoint](!)
context=from-internal
message_context=textmessages
subscribe_context=subscriptions
transport=wss_transport
allow_subscribe=yes
direct_media=no
dtmf_mode=rfc4733

[webrtc_endpoint](!)
transport=wss_transport
allow=opus,ulaw,vp9,vp8,h264
use_avpf=yes
media_encryption=dtls
dtls_verify=fingerprint
dtls_setup=actpass
ice_support=yes
media_use_received_transport=yes
rtcp_mux=yes
```

### **Passo 5: Recarregar Configurações**

```bash
# Via CLI do Asterisk
sudo asterisk -rx "core reload"
sudo asterisk -rx "pjsip reload"
sudo asterisk -rx "dialplan reload"

# Ou reiniciar o Asterisk
sudo systemctl restart asterisk
```

## 🧪 Teste da Configuração

### **1. Verificar Endpoints**
```bash
sudo asterisk -rx "pjsip show endpoints"
```

### **2. Verificar Contextos**
```bash
sudo asterisk -rx "dialplan show textmessages"
```

### **3. Monitorar Logs**
```bash
sudo tail -f /var/log/asterisk/messages
```

### **4. Teste de Mensagem via CLI**
```bash
sudo asterisk -rx "message send to pjsip:1000 from pjsip:teste body 'Teste de mensagem'"
```

## 📋 Estrutura dos Arquivos

```
/etc/asterisk/
├── extensions.conf (principal do FreePBX)
├── extensions_custom.conf (nosso arquivo customizado)
├── pjsip.conf (configuração principal)
└── pjsip_additional.conf (configurações adicionais)
```

## 🔍 Troubleshooting

### **Problema: Mensagens não chegam**
1. Verificar se o contexto `textmessages` está ativo
2. Verificar se os usuários estão registrados
3. Verificar logs do Asterisk

### **Problema: Erro de contexto**
1. Verificar se `#include extensions_custom.conf` foi adicionado
2. Recarregar o dialplan: `dialplan reload`

### **Problema: WebRTC não conecta**
1. Verificar certificados SSL/TLS
2. Verificar configuração de transporte WSS
3. Verificar firewall e portas

## 📝 Logs Esperados

Quando uma mensagem é processada corretamente, você verá:

```
[2025-06-21 13:47:57] -- Executing [teste@textmessages:1] NoOp("Message/ast_msg_queue", "=== MENSAGEM SIP RECEBIDA ===")
[2025-06-21 13:47:57] -- Executing [teste@textmessages:2] NoOp("Message/ast_msg_queue", "De: sip:1000@voipeasy.com.br")
[2025-06-21 13:47:57] -- Executing [teste@textmessages:3] NoOp("Message/ast_msg_queue", "Para: sip:teste@voipeasy.com.br")
[2025-06-21 13:47:57] -- Executing [teste@textmessages:4] NoOp("Message/ast_msg_queue", "Corpo: Olá, como vai?")
[2025-06-21 13:47:57] -- Executing [teste@textmessages:8] MessageSend("Message/ast_msg_queue", "pjsip:teste,sip:1000@voipeasy.com.br")
```

## ✅ Resultado Final

Após a configuração:
- ✅ Mensagens SIP processadas corretamente
- ✅ Não mais erro de dialplan
- ✅ Mensagens entregues entre usuários WebRTC
- ✅ Logs limpos e informativos
- ✅ Compatível com FreePBX (não altera arquivos padrão) 