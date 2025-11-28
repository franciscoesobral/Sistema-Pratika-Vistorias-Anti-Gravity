# 🚀 Guia de Deploy no Vercel - Prátika Vistorias

## ✅ PRÉ-REQUISITOS CONCLUÍDOS

- [x] Código backend e frontend configurados
- [x] Schema Prisma configurado para PostgreSQL
- [x] Scripts de build otimizados
- [x] Arquivos `vercel.json` criados
- [x] Variáveis de ambiente documentadas

---

## 📋 PASSO A PASSO PARA DEPLOY

### 1️⃣ Fazer Push do Código (JÁ ESTÁ PRONTO!)

```bash
# O código já está commitado e pronto para push
git push origin claude/setup-pratika-vistorias-01W2PzRsEHfA7woB1gSsLVu1
```

### 2️⃣ Deploy do Frontend

#### Opção A: Via Dashboard Vercel (Recomendado)

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Selecione o repositório: `franciscoesobral/Sistema-Pratika-Vistorias-Anti-Gravity`
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Clique em **"Deploy"**

#### Opção B: Via CLI

```bash
cd frontend
vercel --prod
```

**Resultado esperado**: Frontend rodando em `https://seu-projeto.vercel.app`

---

### 3️⃣ Deploy do Backend

#### Via Dashboard Vercel (Recomendado)

1. No dashboard Vercel, clique em **"Add New..."** → **"Project"**
2. Selecione o mesmo repositório
3. Configure:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `.` (raiz)
   - **Install Command**: `npm install`
4. **NÃO DEPLOYE AINDA!** Antes, configure o banco de dados (passo 4)

---

### 4️⃣ Adicionar Vercel Postgres (CRÍTICO!)

**O backend PRECISA de um banco de dados para funcionar.**

1. No dashboard do projeto Backend no Vercel:
   - Vá em **"Storage"** (menu lateral)
   - Clique em **"Create Database"**
   - Selecione **"Postgres"**
   - Escolha **"Continue"**
   - Dê um nome: `pratika-db`
   - Região: Escolha a mais próxima (ex: `iad1` para US East)
   - Clique em **"Create"**

2. Conecte o database ao projeto:
   - Vercel vai perguntar qual projeto conectar
   - Selecione o projeto do **backend**
   - Clique em **"Connect"**

3. Variáveis de ambiente injetadas automaticamente:
   ```
   POSTGRES_URL
   POSTGRES_URL_NON_POOLING
   POSTGRES_PRISMA_URL
   POSTGRES_USER
   POSTGRES_HOST
   POSTGRES_PASSWORD
   POSTGRES_DATABASE
   ```

4. **IMPORTANTE**: Adicione manualmente a variável:
   - Nome: `DATABASE_URL`
   - Valor: `${POSTGRES_PRISMA_URL}` (usar referência à variável Postgres)

---

### 5️⃣ Configurar Variáveis de Ambiente do Backend

No dashboard do projeto Backend, vá em **Settings** → **Environment Variables** e adicione:

#### Obrigatórias:
```
DATABASE_URL = ${POSTGRES_PRISMA_URL}
FRONTEND_URL = https://seu-frontend.vercel.app (URL do passo 2)
JWT_SECRET = [GERAR STRING ALEATÓRIA FORTE - 32+ caracteres]
PORT = 3333
```

#### Opcionais (para features avançadas):
```
GOOGLE_CLIENT_ID = (deixar vazio por enquanto)
GOOGLE_CLIENT_SECRET = (deixar vazio por enquanto)
GOOGLE_REFRESH_TOKEN = (deixar vazio por enquanto)
DRIVE_FOLDER_ID = (deixar vazio por enquanto)
SMTP_HOST = (deixar vazio por enquanto)
SMTP_PORT = 587
SMTP_USER = (deixar vazio por enquanto)
SMTP_PASS = (deixar vazio por enquanto)
EMAIL_DESTINO_RELATORIOS = (deixar vazio por enquanto)
```

**Como gerar JWT_SECRET forte:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### 6️⃣ Inicializar Banco de Dados

Após deploy do backend, execute as migrations:

#### Opção A: Via Vercel CLI
```bash
cd backend
vercel env pull .env.production
npx prisma db push --accept-data-loss
```

#### Opção B: Manualmente via SQL
1. Acesse o Vercel Postgres Dashboard
2. Clique em **"Query"**
3. Execute o SQL das migrations em `backend/prisma/migrations/`

---

### 7️⃣ Fazer Deploy do Backend

Agora com DB configurado:
1. Volte ao dashboard do projeto backend
2. Clique em **"Deployments"**
3. Clique em **"Redeploy"** no último deployment
4. Ou faça push de novo commit:
```bash
git commit --allow-empty -m "trigger backend deploy"
git push
```

**Resultado esperado**: Backend rodando em `https://seu-backend.vercel.app`

---

### 8️⃣ Atualizar Frontend com URL do Backend

1. No projeto Frontend no Vercel:
2. **Settings** → **Environment Variables**
3. Adicione:
   ```
   VITE_API_URL = https://seu-backend.vercel.app
   ```
4. Redeploy do frontend

---

### 9️⃣ Testar Sistema Completo

```bash
# Testar Backend
curl https://seu-backend.vercel.app/health

# Testar Frontend
curl https://seu-frontend.vercel.app

# Testar API
curl https://seu-backend.vercel.app/api/lojas
```

---

## 🔐 CRIAR USUÁRIO ADMIN INICIAL

Após deploy bem-sucedido, crie um usuário admin:

### Via Vercel Postgres Query:
```sql
INSERT INTO users (id, name, email, password_hash, role, active, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@pratika.com',
  '$2a$10$HASH_AQUI', -- Gerar hash bcrypt
  'ADMIN',
  true,
  NOW(),
  NOW()
);
```

### Gerar hash bcrypt:
```bash
node -e "console.log(require('bcryptjs').hashSync('senha123', 10))"
```

---

## 📊 CHECKLIST DE DEPLOY

```
Frontend:
□ Projeto criado no Vercel
□ Root directory: frontend
□ Build rodando sem erros
□ Site acessível via HTTPS

Backend:
□ Projeto criado no Vercel
□ Root directory: backend
□ Vercel Postgres criado e conectado
□ DATABASE_URL configurada
□ JWT_SECRET configurada
□ FRONTEND_URL configurada
□ Build rodando sem erros
□ /health retornando {"status":"ok"}

Database:
□ Vercel Postgres provisionado
□ Migrations executadas
□ Tabelas criadas
□ Usuário admin criado

Integração:
□ Frontend conectado ao backend
□ CORS configurado corretamente
□ Login funcionando
```

---

## 🐛 TROUBLESHOOTING

### Erro: "Prisma Client not initialized"
**Solução:**
```bash
# Redeploy com fresh install
vercel --force
```

### Erro: "Database connection failed"
**Solução:** Verificar se DATABASE_URL está usando `POSTGRES_PRISMA_URL`:
```
DATABASE_URL=${POSTGRES_PRISMA_URL}
```

### Erro: CORS blocked
**Solução:** Adicionar FRONTEND_URL correto no backend `.env`

### Build timeout
**Solução:** Otimizar prisma generate:
```json
// package.json
"vercel-build": "prisma generate && tsc"
```

---

## 🎯 URLs FINAIS ESPERADAS

```
Frontend: https://pratika-vistorias.vercel.app
Backend:  https://pratika-vistorias-api.vercel.app
Health:   https://pratika-vistorias-api.vercel.app/health
```

---

## 🔄 FLUXO AUTOMÁTICO (APÓS SETUP INICIAL)

Depois do setup inicial, deployments são automáticos:

1. Faça alterações no código
2. Commit e push:
   ```bash
   git add .
   git commit -m "feat: nova funcionalidade"
   git push
   ```
3. Vercel detecta push e faz deploy automaticamente
4. Verifica preview URL antes de promover para produção

---

## 📝 PRÓXIMOS PASSOS (OPCIONAL)

### 1. Configurar Domínio Customizado
- Settings → Domains → Add Domain

### 2. Configurar Google Drive API
- Obter credenciais em https://console.cloud.google.com
- Adicionar env vars: GOOGLE_CLIENT_ID, etc.

### 3. Configurar SMTP para E-mails
- Usar SendGrid, Resend, ou Gmail SMTP
- Adicionar env vars: SMTP_HOST, SMTP_USER, etc.

### 4. Monitoramento
- Ativar Vercel Analytics
- Configurar logs e alertas

---

## 🆘 SUPORTE

Se encontrar problemas:

1. Verifique logs no Vercel Dashboard → Deployments → Ver detalhes
2. Execute localmente para debug:
   ```bash
   vercel dev
   ```
3. Consulte docs: https://vercel.com/docs

---

**✅ SISTEMA PRONTO PARA PRODUÇÃO APÓS CONCLUSÃO DESTES PASSOS!**
