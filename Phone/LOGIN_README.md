# Tela de Login - Browser Phone

## Visão Geral

Foi adicionada uma tela de login ao Browser Phone que permite aos usuários inserir suas credenciais antes de acessar o telefone. O sistema suporta validação local (para testes) e integração com backend (para produção).

## Funcionalidades

### Tela de Login
- **Interface moderna e responsiva** com design gradiente
- **Suporte a tema escuro** automático baseado nas preferências do sistema
- **Campos obrigatórios**: Usuário e Senha
- **Configurações opcionais do servidor** (expansíveis)
- **Validação local** com arquivo JSON
- **Integração com backend** (preparado para produção)

### Sistema de Validação

#### Validação Local (Atual)
- **Arquivo `users.json`** com usuários de teste
- **Validação instantânea** sem necessidade de servidor
- **Ideal para desenvolvimento e testes**

#### Integração com Backend (Futuro)
- **Autenticação via API REST**
- **Tokens JWT** para sessões seguras
- **Validação de sessão** automática
- **Logout seguro** com notificação ao servidor

### Configurações do Servidor
- **Endereço do Servidor**: Endereço do servidor Asterisk (padrão: localhost)
- **Porta WebSocket**: Porta para conexão WebSocket (padrão: 4443)
- **Caminho WebSocket**: Caminho do WebSocket (padrão: /ws)
- **Domínio SIP**: Domínio SIP (opcional)

### Recursos de Segurança
- **Armazenamento local** das credenciais no localStorage
- **Preenchimento automático** das credenciais salvas
- **Validação de campos** obrigatórios
- **Mensagens de erro** claras e informativas

## Como Usar

### Primeiro Acesso (Validação Local)
1. Abra o `index.html` no navegador
2. A tela de login será exibida automaticamente
3. Use uma das credenciais de teste do arquivo `users.json`:
   - **admin / admin123**
   - **user1 / user123**
   - **teste / teste123**
   - **webrtc / webrtc123**
4. (Opcional) Clique em "Configurações do Servidor" para configurar
5. Clique em "Entrar"

### Acessos Subsequentes
- As credenciais são salvas automaticamente
- Os campos serão preenchidos automaticamente
- Basta clicar em "Entrar" para acessar o telefone

## Arquivos do Sistema

### Arquivos de Validação Local
- `users.json` - Usuários de teste para validação local
- `login.js` - Gerenciamento da tela de login e validação local

### Arquivos para Integração com Backend
- `backend-integration-example.js` - Exemplo completo de integração com API

### Arquivos Modificados
- `index.html` - Adicionada tela de login e estilos CSS
- `phone.js` - Inicialização automática comentada

## Estrutura do Arquivo users.json

```json
{
  "users": [
    {
      "username": "admin",
      "password": "admin123",
      "displayName": "Administrador",
      "sipUsername": "admin",
      "sipPassword": "admin123",
      "wssServer": "localhost",
      "webSocketPort": "4443",
      "serverPath": "/ws",
      "sipDomain": "voipeasy.com.br"
    }
  ]
}
```

### Campos do Usuário
- `username` - Nome de usuário para login
- `password` - Senha para login
- `displayName` - Nome de exibição do usuário
- `sipUsername` - Usuário SIP para conexão com Asterisk
- `sipPassword` - Senha SIP para conexão com Asterisk
- `wssServer` - Endereço do servidor WebSocket
- `webSocketPort` - Porta do WebSocket
- `serverPath` - Caminho do WebSocket
- `sipDomain` - Domínio SIP

## Integração com Backend

### Preparação para Produção

Para integrar com um backend real, siga estes passos:

1. **Configure a API** no arquivo `backend-integration-example.js`:
   ```javascript
   const API_BASE_URL = 'https://sua-api.com';
   ```

2. **Substitua a validação local** pela validação com backend:
   ```javascript
   // Em login.js, substitua:
   validateCredentials(username, password);
   
   // Por:
   validateCredentialsBackend(username, password, callback);
   ```

3. **Implemente os endpoints** no seu backend:
   - `POST /auth/login` - Autenticação
   - `POST /auth/validate` - Validação de token
   - `POST /auth/logout` - Logout
   - `GET /user/profile` - Perfil do usuário

### Exemplo de Resposta da API

```json
{
  "success": true,
  "token": "jwt_token_aqui",
  "expiry": "2024-12-31T23:59:59Z",
  "user": {
    "id": 1,
    "username": "admin",
    "displayName": "Administrador",
    "sipUsername": "admin",
    "sipPassword": "admin123",
    "wssServer": "localhost",
    "webSocketPort": "4443",
    "serverPath": "/ws",
    "sipDomain": "voipeasy.com.br"
  }
}
```

## Estilos CSS

A tela de login inclui:
- **Design responsivo** que funciona em desktop e mobile
- **Tema escuro** automático
- **Animações suaves** nos botões e campos
- **Gradientes modernos** para o fundo e botões

## Integração com o Sistema Existente

### Fluxo de Inicialização
1. `index.html` carrega com a tela de login
2. `login.js` carrega dados dos usuários (`users.json`)
3. Usuário preenche credenciais e submete
4. Sistema valida credenciais localmente
5. Após validação bem-sucedida, `InitPhone()` é chamada
6. `phone.js` inicializa o telefone com as credenciais SIP

### Armazenamento de Dados
As credenciais são salvas no `localStorage`:
- `username` - Nome do usuário
- `password` - Senha (considerar não armazenar em produção)
- `displayName` - Nome de exibição
- `SipUsername` - Nome do usuário SIP
- `SipPassword` - Senha SIP
- `wssServer` - Endereço do servidor
- `WebSocketPort` - Porta WebSocket
- `ServerPath` - Caminho WebSocket
- `SipDomain` - Domínio SIP

## Personalização

### Adicionar Novos Usuários
Para adicionar novos usuários de teste, edite o arquivo `users.json`:

```json
{
  "username": "novo_usuario",
  "password": "nova_senha",
  "displayName": "Novo Usuário",
  "sipUsername": "novo_usuario",
  "sipPassword": "nova_senha",
  "wssServer": "localhost",
  "webSocketPort": "4443",
  "serverPath": "/ws",
  "sipDomain": "voipeasy.com.br"
}
```

### Modificar Validação
Para modificar a lógica de validação, edite a função `validateCredentials()` no arquivo `login.js`.

### Configurar Backend
Para integrar com backend, use o arquivo `backend-integration-example.js` como referência.

## Troubleshooting

### Problemas Comuns

**Tela de login não aparece**
- Verifique se o arquivo `login.js` está sendo carregado
- Confirme que não há erros no console do navegador

**Credenciais não são validadas**
- Verifique se o arquivo `users.json` existe e está acessível
- Confirme que o formato JSON está correto
- Verifique os logs no console do navegador

**Telefone não inicializa após login**
- Verifique se a função `InitPhone()` está sendo chamada
- Confirme que as credenciais SIP estão corretas
- Verifique a conectividade com o servidor Asterisk

### Logs de Debug
O sistema inclui logs detalhados no console:
- "Users data loaded successfully"
- "Login successful for user: [nome]"
- "Login failed for username: [username]"
- "Initializing Browser Phone after login..."

## Compatibilidade

- **Navegadores**: Chrome, Firefox, Safari, Edge (versões modernas)
- **Dispositivos**: Desktop, tablet, mobile
- **Asterisk**: Compatível com versões que suportam WebRTC
- **HTTPS**: Recomendado para produção (WebRTC requer conexão segura)

## Segurança

### Validação Local (Desenvolvimento)
- Credenciais armazenadas em arquivo JSON (não seguro para produção)
- Sem criptografia das senhas
- Ideal apenas para desenvolvimento e testes

### Integração com Backend (Produção)
- Autenticação via API segura
- Tokens JWT com expiração
- Senhas não armazenadas localmente
- HTTPS obrigatório
- Validação de sessão automática

### Recomendações para Produção
- Use HTTPS em produção
- Implemente rate limiting no backend
- Use tokens JWT com expiração curta
- Implemente refresh tokens
- Monitore tentativas de login mal-sucedidas
- Considere autenticação de dois fatores
- Implemente logout em todos os dispositivos

## Próximos Passos

1. **Teste a validação local** com os usuários de teste
2. **Configure seu backend** seguindo o exemplo em `backend-integration-example.js`
3. **Substitua a validação local** pela integração com backend
4. **Implemente funcionalidades adicionais** como:
   - Recuperação de senha
   - Registro de novos usuários
   - Perfil do usuário
   - Configurações personalizadas por usuário 