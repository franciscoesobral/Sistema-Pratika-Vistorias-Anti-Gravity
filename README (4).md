🛠️ README.md — Prátika Vistorias (Versão Completa com Execução Local)
# 🛠️ Prátika Vistorias  
### Sistema de Gestão Operacional & Financeira com IA  
### **Versão com Execução Local (Backend + Frontend + Banco + Workers)**

O sistema **Prátika Vistorias** foi desenvolvido para automatizar por completo o fluxo operacional e financeiro de vistorias cautelares.  
Ele substitui processos manuais, elimina planilhas frágeis e entrega uma operação moderna, inteligente e escalável.

Agora com **execução local completa**, utilizando banco de dados, backend, workers e geração nativa de relatórios PDF/Excel.

---

# 📌 Visão Geral

A plataforma integra múltiplos módulos:

- Ingestão automática de laudos PDF via Google Drive  
- Extração inteligente de dados do laudo  
- Registro automatizado no banco  
- Dashboards operacionais e financeiros  
- Controle total de contas a pagar/receber  
- Sistema de metas por loja/perito  
- Gamificação de produção  
- Relatórios em PDF e Excel (on-demand e automáticos)  
- Alertas de queda de produção  
- Execução local para zero custo mensal  

---

# 🚀 Funcionalidades Principais

## 1. 📝 Ingestão Automática de Laudos (PDF → Dados Estruturados)
- Monitoramento de pasta do Google Drive  
- Extração automática dos dados:
  - Loja  
  - Placa  
  - Data  
  - Perito  
  - Tipo de serviço  
  - Valor  
  - Status financeiro  
- Validação automática  
- Registro no banco  
- Histórico de auditoria  

---

## 2. 📊 Dashboard Operacional & Financeiro

### Métricas:
- Perícias por dia/semana/mês  
- Faturamento  
- Comparativo por loja  
- Comparativo por perito  
- Ranking  
- Tendências  
- Alertas automáticos  

---

## 3. 💰 Controle Financeiro Completo
- Contas a receber (lançamento automático via laudos)  
- Contas a pagar  
- Fluxo de caixa  
- Upload de comprovantes e notas  
- Acompanhamento de saldo  
- Relatórios financeiros PDF/Excel  

---

## 4. 🎯 Sistema de Metas
- Metas por loja  
- Metas por perito  
- Meta geral mensal  
- Barras de progresso e percentuais  

---

## 5. 🎮 Gamificação de Peritos
Pontuação padrão:
- Perícia → 10 pts  
- Consulta → 5 pts  
- Atualização → 3 pts  

Relatórios automáticos:
- Ranking semanal  
- Ranking mensal  
- Campeão da semana/mês  

---

## 6. 📧 Relatórios Automáticos (E-mail)
Relatórios enviados via worker:

- **Diário** — às 06:00  
- **Semanal** — segundas às 08:00  
- **Quinzenal** — dias 01 e 15 às 08:00  
- **Mensal** — primeiro dia útil às 08:00  

Conteúdo:
- Total de perícias  
- Faturamento  
- Lista de pendências  
- Ranking  
- Queda/crescimento  
- PDF e Excel anexados  

---

## 7. 📄 Relatórios On-Demand (PDF & Excel)
Todos os relatórios podem ser gerados instantaneamente:

### Endpoints:
- `GET /relatorios/lojas/pdf`
- `GET /relatorios/lojas/excel`
- `GET /relatorios/peritos/pdf`
- `GET /relatorios/peritos/excel`
- `GET /relatorios/financeiro/pdf`
- `GET /relatorios/financeiro/excel`

### Tecnologias:
- **Puppeteer** → PDF com layout profissional  
- **ExcelJS** → planilhas completas  

---

# 🧱 Arquitetura



Frontend (Next.js / React)
↓
Backend API (Node.js + TypeScript)
↓
PostgreSQL (Execução local ou externa)
↓
Workers
├── ingestão Google Drive
├── relatório diário
├── relatório semanal
├── relatório quinzenal
├── relatório mensal
↓
Geração PDF/Excel


---

# 🗂️ Modelo de Dados (Tabelas Principais)

- `lojas`  
- `peritos`  
- `servicos`  
- `contas_receber`  
- `contas_pagar`  
- `clientes_particulares`  
- `metas`  
- `gamificacao_peritos`  

Ver detalhes completos em:  
📄 `docs/DATA_MODEL.md`

---

# 📁 Estrutura do Repositório



/
├── backend/
│ ├── src/
│ ├── workers/
│ ├── prisma/
│ ├── package.json
│ └── README.md
│
├── frontend/
│ ├── src/
│ ├── public/
│ ├── package.json
│ └── README.md
│
├── docs/
│ ├── ARCHITECTURE.md
│ ├── DATA_MODEL.md
│ ├── IMPLEMENTATION_PLAN.md
│ ├── GOOGLE_DRIVE_INTEGRATION.md
│ ├── EMAIL_REPORTS.md
│ └── LOCAL_SERVER_SETUP.md
│
└── README.md


---

# 🛠️ Execução Local

Abaixo está o passo a passo **completo** para rodar 100% do sistema localmente, sem custo mensal.

---

# 🧰 1. Pré-requisitos

### Sistema local (Windows, Linux, macOS ou mini-PC)
- Node.js 18+
- PostgreSQL 14+
- Git
- Docker (opcional)

---

# 🗄️ 2. Banco de Dados Local

Opcionalmente você pode usar Docker:

```sh
docker run --name praktika-db -e POSTGRES_PASSWORD=admin -e POSTGRES_DB=praktika -p 5432:5432 -d postgres

🔧 3. Configurar Variáveis de Ambiente

Crie o arquivo backend/.env:

DATABASE_URL=postgresql://user:password@localhost:5432/pratika

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
DRIVE_FOLDER_ID=

SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
EMAIL_DESTINO_RELATORIOS=

📦 4. Instalar Dependências
Backend
cd backend
npm install

Frontend
cd ../frontend
npm install

🗃️ 5. Criar Banco de Dados

Se usar Prisma:

cd backend
npx prisma migrate dev


Ou execute o script SQL em docs/migrations.sql.

▶️ 6. Rodar o Backend (Local)
npm run dev

🌐 7. Rodar o Frontend (Local)
npm run dev


Acesse:
http://localhost:3000

⚙️ 8. Rodar os Workers Locais

Workers responsáveis por ingestão, PDFs, Excel e e-mails:

node workers/ingestao.js
node workers/relatorio-diario.js
node workers/relatorio-semanal.js
node workers/relatorio-quinzenal.js
node workers/relatorio-mensal.js


Ou rodar todos via PM2:

pm2 start workers.config.js

📤 Deploy (Opcional)
Frontend → Vercel (Free)
Backend → Render (Starter)
Banco → Supabase / Railway
Workers → MiniPC local (custo zero)
📅 Roadmap

Painel avançado de tendências

App mobile para peritos

IA de leitura automática de placas

Previsão de faturamento (machine learning)

Dashboard de eficiência operacional

🤝 Contribuições

Pull Requests são bem-vindos.
O projeto está em evolução contínua.

📄 Licença

Licenciado sob MIT License.
