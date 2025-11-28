# ⚡ Quick Start - Deploy no Vercel (5 minutos)

## 🎯 Deploy Automático via GitHub

Se o repositório já está conectado ao Vercel, basta fazer **merge para main**:

```bash
# Fazer merge da branch atual para main
git checkout main
git merge claude/setup-pratika-vistorias-01W2PzRsEHfA7woB1gSsLVu1
git push origin main
```

**Vercel vai detectar automaticamente e fazer deploy!** ✨

---

## 🆕 Primeira Vez no Vercel? (Setup Inicial)

### 1. Conectar Repositório ao Vercel (1 min)

1. Acesse: https://vercel.com/new
2. Importe: `franciscoesobral/Sistema-Pratika-Vistorias-Anti-Gravity`
3. Clique "Import"

### 2. Deploy Frontend (2 min)

```
Project Name: pratika-vistorias
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

Clique **"Deploy"** → Aguarde build → ✅ Frontend ONLINE

### 3. Deploy Backend (2 min)

1. Vercel → "Add New Project"
2. Mesmo repositório
```
Project Name: pratika-vistorias-api
Framework: Other
Root Directory: backend
Build Command: npm run vercel-build
```

3. **ANTES de Deploy**: Adicionar Vercel Postgres:
   - Storage → Create Database → Postgres
   - Nome: `pratika-db`
   - Conectar ao projeto backend

4. Adicionar env var:
   ```
   DATABASE_URL = ${POSTGRES_PRISMA_URL}
   JWT_SECRET = [gerar com: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
   FRONTEND_URL = [URL do frontend do passo 2]
   ```

5. Clique **"Deploy"** → ✅ Backend ONLINE

---

## 🔄 Deploy via CLI (Alternativo)

### Frontend:
```bash
cd frontend
vercel login  # Login interativo no browser
vercel --prod
```

### Backend:
```bash
cd backend
vercel login
vercel --prod

# Depois de fazer deploy, linkar Postgres:
# Vercel Dashboard → Storage → Connect
```

---

## ✅ Verificar Deploy

```bash
# Frontend
curl https://seu-projeto.vercel.app

# Backend Health Check
curl https://seu-backend.vercel.app/health
# Deve retornar: {"status":"ok","timestamp":"..."}
```

---

## 🚨 Problemas?

Consulte **VERCEL_DEPLOY_GUIDE.md** para guia detalhado e troubleshooting.

---

**🎉 Pronto! Sistema no ar em menos de 5 minutos!**
