# Guia de Deploy - Gestão Padaria

## Configuração no Render.com

### 1. Variáveis de Ambiente Necessárias

Configure as seguintes variáveis de ambiente no painel do Render.com:

```
DATABASE_URL=postgresql://username:password@host:port/database?schema=public&sslmode=require
NODE_ENV=production
PORT=3001
PADARIA_USER=admin
PADARIA_PASS=sua_senha_segura
```

**Nota para Neon.tech**: A URL do Neon geralmente inclui `sslmode=require` e outros parâmetros específicos. Certifique-se de usar a URL completa fornecida pelo Neon.

### 2. Configurações do Serviço

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Health Check Path**: `/health`

### 3. Banco de Dados Neon.tech

1. ✅ Banco já configurado no Neon.tech
2. ✅ URL de conexão configurada na variável `DATABASE_URL`
3. ⚠️ **Importante**: Execute as migrações após o deploy:
   ```bash
   npm run db:migrate
   ```

### 4. Verificação de Deploy

Após o deploy, acesse:
- `https://seu-app.onrender.com/health` - Para verificar o status da API e conexão com Neon
- `https://seu-app.onrender.com/` - Para verificar se a API está rodando

### 5. Logs e Debug

Para verificar logs e erros:
1. Acesse o painel do Render.com
2. Vá para a aba "Logs"
3. Procure por mensagens específicas:
   - ✅ "Conexão com o banco estabelecida com sucesso!"
   - ❌ Erros de SSL/TLS
   - ❌ Erros de timeout de conexão
   - ❌ Erros de autenticação

### 6. Problemas Específicos do Neon.tech

#### Erro de SSL/TLS
- Verifique se a URL inclui `sslmode=require`
- Confirme se o certificado SSL está válido

#### Erro de Timeout
- O Neon pode ter timeouts diferentes
- Verifique se a conexão está sendo fechada corretamente

#### Erro de Pool de Conexões
- O Neon pode ter limites de conexões simultâneas
- Verifique se as conexões estão sendo gerenciadas corretamente

### 7. Teste de Conexão Específico para Neon

Execute o teste de conexão para verificar especificamente o Neon:

```bash
npm run test:db
```

Este teste verificará:
- ✅ Conexão SSL com o Neon
- ✅ Acesso às tabelas
- ✅ Operações básicas de CRUD
- ✅ Contagem de registros

### 8. Configurações Recomendadas para Neon

No seu `schema.prisma`, certifique-se de que está configurado assim:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

A URL do Neon deve incluir todos os parâmetros necessários fornecidos pelo painel do Neon.tech.

### 9. Problemas Comuns

#### Erro de Conexão com Banco
- Verifique se a `DATABASE_URL` está correta
- Confirme se o banco está ativo no Render.com
- Verifique se as migrações foram executadas

#### Erro de Build
- Verifique se todas as dependências estão no `package.json`
- Confirme se os scripts estão configurados corretamente

#### Erro de Start
- Verifique os logs para identificar o problema específico
- Confirme se a porta está configurada corretamente 