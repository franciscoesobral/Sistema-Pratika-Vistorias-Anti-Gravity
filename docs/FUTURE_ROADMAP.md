# 🚀 Roadmap de Melhorias Futuras - Prátika Vistorias

Este documento descreve as iniciativas planejadas para elevar o nível de maturidade, escalabilidade e robustez do sistema Prátika Vistorias nas próximas fases.

---

## 🏗️ 1. Arquitetura & Backend

### 🔹 Filas de Mensageria (Background Jobs)
*   **Atual:** Uso de `node-cron` em memória. Se o servidor reiniciar, jobs em execução são perdidos.
*   **Futuro:** Implementar **Redis + BullMQ**.
    *   **Benefício:** Persistência de jobs, retentativas automáticas em caso de falha, separação física entre API e Workers.

### 🔹 Cache Layer
*   **Atual:** Consultas diretas ao banco de dados.
*   **Futuro:** Implementar Cache com **Redis**.
    *   **Benefício:** Redução drástica de latência em rotas de leitura (ex: Dashboard, Listagem de Lojas) e alívio de carga no PostgreSQL.

### 🔹 Armazenamento de Arquivos (Storage)
*   **Atual:** Processamento local temporário.
*   **Futuro:** Integração com **AWS S3** ou **Google Cloud Storage**.
    *   **Benefício:** Armazenamento seguro, escalável e desacoplado do servidor de aplicação para PDFs gerados e comprovantes.

---

## ⚙️ 2. DevOps & Infraestrutura

### 🔹 CI/CD (Integração e Entrega Contínuas)
*   **Atual:** Deploy manual ou via Docker Compose local.
*   **Futuro:** Pipelines no **GitHub Actions**.
    *   **Benefício:** Testes automáticos a cada Push, build de imagens Docker e deploy automático em Homologação/Produção.

### 🔹 Monitoramento & Observabilidade
*   **Atual:** Logs no console (stdout).
*   **Futuro:** Implementar **Sentry** (erros), **Prometheus/Grafana** (métricas) ou **Datadog**.
    *   **Benefício:** Alertas em tempo real sobre falhas, lentidão e saúde do sistema.

### 🔹 Container Orchestration
*   **Atual:** Docker Compose (monolítico).
*   **Futuro:** Preparar para **Kubernetes (K8s)** ou **Google Cloud Run**.
    *   **Benefício:** Auto-scaling (aumentar servidores conforme a demanda) e alta disponibilidade (Zero Downtime Deploy).

---

## 🧪 3. Qualidade (QA) & Testes

### 🔹 Testes Automatizados
*   **Atual:** Testes manuais.
*   **Futuro:**
    *   **Unitários (Jest):** Cobrir regras de negócio críticas (Cálculo de comissões, validações).
    *   **Integração (Supertest):** Testar rotas da API e conexão com Banco.
    *   **E2E (Cypress/Playwright):** Simular fluxos do usuário no Frontend.

---

## 🛡️ 4. Segurança Avançada

### 🔹 Gestão de Identidade
*   **Atual:** JWT simples.
*   **Futuro:** Implementar **Refresh Tokens** com rotação e revogação de sessões (Blacklist no Redis).
*   **Futuro:** 2FA (Autenticação de Dois Fatores) para perfis administrativos.

### 🔹 Auditoria de Dados (Audit Logs)
*   **Futuro:** Tabela de `AuditLogs` para registrar QUEM fez O QUE e QUANDO (ex: "Usuário X excluiu a Vistoria Y"). Essencial para compliance e rastreabilidade.

---

## 📱 5. Funcionalidades de Negócio

### 🔹 App Mobile
*   **Futuro:** Desenvolver versão Mobile (React Native) para Peritos lançarem vistorias offline em campo.

### 🔹 Webhooks
*   **Futuro:** Permitir que Lojas cadastradas recebam notificações (Webhooks) quando uma vistoria for concluída.

---

## 📅 Priorização Sugerida

1.  **Curto Prazo (Q1):** CI/CD, Testes Unitários, Sentry.
2.  **Médio Prazo (Q2):** Redis (Filas e Cache), Refresh Tokens.
3.  **Longo Prazo (Q3+):** Kubernetes, App Mobile.
