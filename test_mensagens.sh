#!/bin/bash

# ========================================
# SCRIPT DE TESTE E DIAGNÓSTICO - MENSAGENS SIP
# ========================================

echo "🔧 DIAGNÓSTICO DE MENSAGENS SIP"
echo "================================"

# Verificar se o Asterisk está rodando
echo "1. Verificando se o Asterisk está rodando..."
if pgrep asterisk > /dev/null; then
    echo "   ✅ Asterisk está rodando"
else
    echo "   ❌ Asterisk não está rodando"
    exit 1
fi

# Verificar contextos carregados
echo ""
echo "2. Verificando contextos carregados..."
asterisk -rx "dialplan show textmessages" | head -10
echo ""

# Verificar endpoints PJSIP
echo "3. Verificando endpoints PJSIP..."
asterisk -rx "pjsip show endpoints" | grep -E "(1000|1004|user1|teste|webrtc)"
echo ""

# Verificar configuração de mensagens
echo "4. Verificando configuração de mensagens..."
asterisk -rx "pjsip show endpoint 1000" | grep -i message
asterisk -rx "pjsip show endpoint 1004" | grep -i message
echo ""

# Teste de envio de mensagem
echo "5. Testando envio de mensagem..."
echo "   Enviando mensagem de teste de 1004 para 1000..."
asterisk -rx "message send to pjsip:1000 from pjsip:1004 body 'Teste automatico - $(date)'"
echo ""

# Monitorar logs (últimas 20 linhas)
echo "6. Últimas mensagens do log do Asterisk:"
echo "========================================"
tail -20 /var/log/asterisk/messages | grep -E "(Message|textmessages|MessageSend)"
echo ""

echo "🧪 COMANDOS ÚTEIS PARA DEBUG:"
echo "============================="
echo "• Monitorar logs em tempo real:"
echo "  tail -f /var/log/asterisk/messages | grep -i message"
echo ""
echo "• Verificar contexto textmessages:"
echo "  asterisk -rx 'dialplan show textmessages'"
echo ""
echo "• Verificar endpoint específico:"
echo "  asterisk -rx 'pjsip show endpoint 1000'"
echo ""
echo "• Enviar mensagem de teste:"
echo "  asterisk -rx \"message send to pjsip:1000 from pjsip:1004 body 'Teste'\""
echo ""
echo "• Recarregar configurações:"
echo "  asterisk -rx 'pjsip reload'"
echo "  asterisk -rx 'dialplan reload'" 