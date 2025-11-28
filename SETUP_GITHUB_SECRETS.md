# 🔐 Setup GitHub Secrets para Deploy Automático

Para habilitar deploy automático no Vercel via GitHub Actions, configure os seguintes secrets:

## 📋 Secrets Necessários

Vá em: **GitHub Repo** → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 1. VERCEL_TOKEN

**Como obter:**
1. Acesse: https://vercel.com/account/tokens
2. Clique em **"Create Token"**
3. Nome: `GitHub Actions Deploy`
4. Scope: Full Account
5. Copie o token gerado

**Adicionar no GitHub:**
```
Name: VERCEL_TOKEN
Value: [token copiado]
```

### 2. VERCEL_ORG_ID

**Como obter:**
1. Acesse projeto no Vercel
2. Settings → General
3. Procure por "Vercel ID" ou execute:
```bash
vercel whoami
# Output mostra: Your ID (Team/User): org_xxxxx
```

**Adicionar no GitHub:**
```
Name: VERCEL_ORG_ID
Value: org_xxxxxxxxxxxxx
```

### 3. VERCEL_FRONTEND_PROJECT_ID

**Como obter:**
1. Projeto frontend no Vercel
2. Settings → General → Project ID

**Adicionar no GitHub:**
```
Name: VERCEL_FRONTEND_PROJECT_ID
Value: prj_xxxxxxxxxxxxx
```

### 4. VERCEL_BACKEND_PROJECT_ID

**Como obter:**
1. Projeto backend no Vercel
2. Settings → General → Project ID

**Adicionar no GitHub:**
```
Name: VERCEL_BACKEND_PROJECT_ID
Value: prj_xxxxxxxxxxxxx
```

---

## ✅ Verificar Configuração

Após adicionar os secrets:

1. Vá em **Actions** no GitHub
2. Deve aparecer workflow: "Vercel Deploy"
3. Clique em **"Run workflow"** para testar
4. Ou faça push para main:
```bash
git push origin main
```

Deploy será automático! 🚀

---

## 🔄 Fluxo Automático

Após setup:
```
git push origin main
  ↓
GitHub Actions triggered
  ↓
Deploy Frontend → Vercel
  ↓
Deploy Backend → Vercel
  ↓
✅ Sistema atualizado automaticamente
```

---

## 📝 Alternativa Sem GitHub Actions

Se preferir deploy manual via Vercel CLI:
```bash
cd frontend && vercel --prod
cd ../backend && vercel --prod
```

Ou via Vercel Dashboard conectando o repositório.
