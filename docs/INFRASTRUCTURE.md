# Infraestrutura e Arquitetura

## Visão Geral
A aplicação segue uma arquitetura de **Monorepo** com separação clara entre Frontend e Backend, containerizada via Docker para desenvolvimento e orquestrada via CI/CD para deploy.

## Diagrama de Arquitetura

```mermaid
graph TD
    User[Usuário / Perito] -->|Acessa via Browser| Frontend
    Frontend[Frontend (React + Vite)] -->|HTTP/REST| Backend
    Backend[Backend (Node.js + Prisma)] -->|SQL| DB[(PostgreSQL)]
    Backend -->|Lê Arquivos| GDrive[Google Drive API]
    Backend -->|Envia Relatórios| SMTP[Servidor de Email]
    
    subgraph "Docker Compose (Local)"
        Frontend
        Backend
        DB
    end
```

## Stack Tecnológico

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS v3
- **Linguagem:** TypeScript

### Backend
- **Runtime:** Node.js
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL 15
- **Linguagem:** TypeScript

### DevOps
- **Containerização:** Docker & Docker Compose
- **CI/CD:** GitHub Actions
- **Versionamento:** Git

## Fluxo de Dados
1. **Ingestão:** O Backend monitora periodicamente uma pasta no Google Drive.
2. **Processamento:** Arquivos PDF são lidos e dados são extraídos.
3. **Persistência:** Dados estruturados são salvos no PostgreSQL via Prisma.
4. **Visualização:** O Frontend consome a API para exibir dashboards e relatórios.
