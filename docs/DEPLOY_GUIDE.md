# Guia de Deploy e Implantação - Financeiro Pratika Vistorias

Este guia detalha o processo de deploy e implantação da aplicação Financeiro Pratika Vistorias, cobrindo desde a configuração local até o ambiente de produção.

## 📋 Pré-requisitos

Para rodar a aplicação, você precisará de:

- **Docker** e **Docker Compose** instalados.
- **Node.js** (v18+) instalado (para desenvolvimento local sem Docker).
- **Git** instalado.
- Conta no **Google Cloud Platform** (para integração com Drive).
- Conta de e-mail SMTP (para envio de relatórios).

---

## ⚙️ Configuração de Ambiente (.env)

A aplicação requer variáveis de ambiente para funcionar. Crie um arquivo `.env` na pasta `backend/` com base no exemplo abaixo:

```ini
# Banco de Dados
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pratika?schema=public"

# Integração Google Drive
GOOGLE_CLIENT_ID="seu_client_id"
GOOGLE_CLIENT_SECRET="seu_client_secret"
GOOGLE_REFRESH_TOKEN="seu_refresh_token"
DRIVE_FOLDER_ID="id_da_pasta_no_drive"

# Serviço de Email (SMTP)
SMTP_HOST="smtp.exemplo.com"
SMTP_PORT=587
SMTP_USER="seu_email@exemplo.com"
SMTP_PASS="sua_senha"
EMAIL_DESTINO_RELATORIOS="admin@pratika.com.br"

# Servidor
PORT=3333
```

> **⚠️ IMPORTANTE:** Nunca commite o arquivo `.env` no repositório.

---

## 🚀 Deploy Local (Docker)

A maneira mais fácil de rodar a aplicação localmente é usando Docker Compose.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/financeiro-pratika.git
   cd financeiro-pratika
   ```

2. **Configure o .env:**
   Copie o exemplo e preencha com suas credenciais.
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Suba os containers:**
   ```bash
   docker-compose up --build
   ```

   Isso iniciará:
   - **Banco de Dados (PostgreSQL):** Porta `5432`
   - **Backend API:** Porta `3333` (http://localhost:3333)
   - **Frontend:** Porta `5173` (http://localhost:5173)

---

## ☁️ Deploy em Produção

Recomendamos uma arquitetura separada para produção:

### 1. Banco de Dados (PostgreSQL)
Use um serviço gerenciado como **Supabase**, **Railway** ou **AWS RDS**.
- Crie o banco de dados.
- Obtenha a `DATABASE_URL` de conexão.
- No backend, rode as migrações:
  ```bash
  npx prisma migrate deploy
  ```

### 2. Backend (Node.js API)
Pode ser hospedado em **Render**, **Railway**, **Heroku** ou **VPS**.

**Exemplo no Render/Railway:**
- Conecte seu repositório GitHub.
- Configure a pasta raiz como `backend/`.
- Comando de Build: `npm install && npm run build`
- Comando de Start: `npm start` (ou `node dist/index.js`)
- **Variáveis de Ambiente:** Adicione todas as variáveis do `.env` no painel de configuração do serviço.

### 3. Frontend (React/Vite)
Recomendamos **Vercel** ou **Netlify**.

**Exemplo na Vercel:**
- Conecte seu repositório GitHub.
- Configure a pasta raiz como `frontend/`.
- Framework Preset: `Vite`.
- Comando de Build: `npm run build`
- Output Directory: `dist`
- **Variáveis de Ambiente:**
  - `VITE_API_URL`: URL do seu backend em produção (ex: `https://api.pratika.com.br`).

---

## 🔄 Integrações

### Google Drive API
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/).
2. Crie um projeto e ative a **Google Drive API**.
3. Crie credenciais OAuth 2.0.
4. Use o Playground do OAuth para obter o `REFRESH_TOKEN`.

### SMTP (E-mail)
Use serviços como **SendGrid**, **Amazon SES** ou o próprio SMTP do seu provedor de e-mail corporativo.

---

## 🛠️ Manutenção e Logs

- **Logs do Backend:** Verifique a saída padrão do container ou painel do serviço de hospedagem.
- **Monitoramento:** Configure serviços como **Sentry** para rastreamento de erros.
