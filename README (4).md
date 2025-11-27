🛠️ PRÁTIKA VISTORIAS – Sistema de Gestão Operacional & Financeira com IA

Automação total do fluxo de vistorias cautelares, financeiro completo, dashboards, gamificação de peritos e ingestão automática de laudos via Google Drive.
Este repositório contém o backend, frontend, banco de dados e documentação da plataforma desenvolvida para a empresa Prátika Vistorias.

📌 Visão Geral

O Sistema Prátika Vistorias nasceu para substituir processos manuais, planilhas frágeis e trabalho repetitivo por uma plataforma unificada, inteligente e automatizada.

A aplicação integra:

Leitura automática de laudos PDF enviados ao Google Drive

Extração dos dados do laudo (loja, perito, placa, valor, serviço etc.)

Registro automático no banco de dados

Controle financeiro completo

Dashboards e gráficos de desempenho

Rankings semanais e mensais (gamificação)

Alertas automáticos para queda de produção por loja

Relatórios automáticos por e-mail (diário, quinzenal e mensal)

O objetivo é eliminar retrabalho, aumentar eficiência, permitir tomada de decisão rápida e dar visibilidade total da operação.

🚀 Funcionalidades Principais
✅ 1. Ingestão automática de laudos (PDF → Dados estruturados)

Monitoramento de uma pasta específica no Google Drive

Leitura do PDF usando OCR ou parser customizado

Extração de:

Nome da loja

Placa do veículo

Data da vistoria

Nome do perito

Tipo de serviço (perícia, consulta, atualização)

Valor

Status de pagamento

Validação e armazenamento dos dados no banco.

✅ 2. Dashboard com métricas em tempo real

Inclui:

Total de perícias por dia/semana/mês

Faturamento diário e mensal

Produção por loja

Produção por perito

Gráficos comparativos

Lojas com queda de produção (alerta automático)

Ranking de peritos

Ranking de lojas

✅ 3. Controle Financeiro Completo

Contas a Receber

Lançamento automático via laudos

Acompanhamento de faturamento por loja e por período

Status: pago, em aberto, vencido, negociado

Upload e gestão de NF, boletos e comprovantes

Contas a Pagar

Cadastro de despesas fixas e variáveis

Controle de fornecedores

Upload de comprovantes

Previsão de fluxo de caixa

✅ 4. Sistema de Metas

Metas por loja

Metas por perito

Meta mensal da empresa

Acompanhamento por percentuais e barras de progresso

🎮 5. Gamificação (Ranking de Peritos)

Pontos configuráveis:

Perícia = 10 pontos

Consulta = 5 pontos

Atualização = 3 pontos

Geração automática de:

Ranking semanal

Ranking mensal

Campeão da Semana

Campeão do Mês

📧 6. Relatórios Automáticos por E-mail

Envios automáticos:

Diário → resumo de perícias e faturamento

Semanal → ranking de lojas e peritos

Mensal → relatório financeiro completo

Informações enviadas:

Quantidade de perícias

Total faturado

Top perito

Top loja

Lojas com crescimento e queda

Contas a pagar e resumo de caixa

🧱 Arquitetura da Solução
Frontend (Next.js/React)
       ↓
Backend API (Node.js + TypeScript)
       ↓
PostgreSQL (Banco de dados relacional)
       ↓
Integração Google Drive (PDF ingestion)
       ↓
Serviços auxiliares:
  - OCR/Leitura de PDF
  - Envio de e-mails (SMTP)
  - Scripts de relatórios

🗂️ Modelo de Dados – Tabelas Principais

lojas

clientes_particulares

peritos

servicos

contas_receber

contas_pagar

metas

gamificacao_peritos

(Ver arquivo DATA_MODEL.md para estrutura completa com campos e relacionamentos.)

📁 Estrutura do Repositório
/
├── backend/
│   ├── src/
│   ├── prisma/ (ou migrations SQL)
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── DATA_MODEL.md
│   ├── IMPLEMENTATION_PLAN.md
│   ├── GOOGLE_DRIVE_INTEGRATION.md
│   └── EMAIL_REPORTS.md
│
└── README.md

🛠️ Como Rodar Localmente
1. Clone o repositório
git clone https://github.com/SEU-USUARIO/pratika-vistorias.git
cd praktika-vistorias

2. Configurar Variáveis de Ambiente

Crie um arquivo .env na pasta backend:

DATABASE_URL=postgresql://user:password@localhost:5432/pratika
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
DRIVE_FOLDER_ID=
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_DESTINO_RELATORIOS=

3. Instalar dependências
Backend:
cd backend
npm install

Frontend:
cd ../frontend
npm install

4. Criar Banco de Dados

Se usar Prisma:

cd backend
npx prisma migrate dev


Ou executar o script SQL em docs/migrations.sql.

5. Rodar o Backend
npm run dev

6. Rodar o Frontend
npm run dev

🌐 Deploy

Recomendações:

Backend
Render, Railway ou VPS

Frontend
Vercel ou Netlify

Banco
Supabase, Railway ou RDS Lite

Arquivo DEPLOY_GUIDE.md (opcional) pode ser criado para orientar cada ambiente.

🧪 Roadmap (Próximas Etapas)

 API de auditoria

 Painel de desempenho avançado

 App mobile para peritos

 Reconhecimento automático da placa via visão computacional

 Dashboard de tendências (previsão de faturamento)

🤝 Contribuições

Pull Requests, issues e melhorias são bem-vindos.
Este sistema foi criado para evoluir continuamente e suportar expansão da empresa.

📄 Licença

Este projeto está licenciado sob MIT License.
