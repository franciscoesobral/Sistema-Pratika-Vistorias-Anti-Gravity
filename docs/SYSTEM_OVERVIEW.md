# Raio-X do Sistema: Financeiro Prátika Vistorias

## 1. Introdução e Propósito
O **Sistema Financeiro Prátika Vistorias** é uma plataforma integrada de gestão operacional e financeira, desenvolvida sob medida para automatizar o fluxo de trabalho de empresas de vistoria veicular. 

O objetivo central da aplicação é eliminar o trabalho manual de digitação de laudos, garantir a integridade financeira (contas a receber e pagar) e engajar a equipe através de gamificação, tudo isso suportado por uma arquitetura moderna e escalável.

---

## 2. Diferenciais e Proposta de Valor
Ao contrário de ERPs genéricos, esta solução foi desenhada para a realidade específica de vistorias:
- **Automação Zero-Toque:** O sistema lê PDFs diretamente do Google Drive sem intervenção humana.
- **Gamificação Nativa:** Rankings automáticos de peritos estimulam a produtividade.
- **Visão 360º:** Integração total entre a operação (laudos realizados) e o financeiro (faturamento gerado).

---

## 3. Funcionalidades Core

### 3.1. Ingestão Automática de Laudos (OCR & Parser)
O coração do sistema é um motor de ingestão que:
1. Monitora uma pasta específica no **Google Drive**.
2. Detecta novos arquivos PDF de laudos.
3. Aplica algoritmos de extração de texto (OCR/Parsing) para identificar:
   - Placa do Veículo
   - Perito Responsável
   - Loja/Cliente
   - Tipo de Serviço (Vistoria, Perícia, etc.)
   - Valor do Serviço
4. Registra automaticamente o serviço no banco de dados e gera a conta a receber correspondente.

### 3.2. Módulo Financeiro
- **Contas a Receber:** Alimentado automaticamente pela ingestão de laudos. Permite baixa manual ou automática.
- **Contas a Pagar:** Gestão de despesas fixas e variáveis, fornecedores e fluxo de caixa.
- **Conciliação:** Relatórios que cruzam produção operacional com entradas financeiras.

### 3.3. Gamificação e Performance
- **Rankings:** Classificação semanal e mensal de peritos baseada em pontuação (configurável por tipo de serviço).
- **Metas:** Acompanhamento visual de metas individuais e por loja.
- **Dashboards:** Gráficos de tendência de faturamento e produtividade.

### 3.4. Relatórios Inteligentes
Envio automático de e-mails (diários, semanais, mensais) com resumos executivos para a diretoria, eliminando a necessidade de acessar o sistema para ver os números básicos.

---

## 4. Arquitetura Técnica

O sistema utiliza uma arquitetura **Monorepo** baseada em microsserviços lógicos, containerizada para fácil deploy.

### 4.1. Frontend (A Camada Visual)
- **Tecnologia:** React 19 + Vite.
- **Linguagem:** TypeScript.
- **Estilização:** Tailwind CSS (Design System moderno e responsivo).
- **Hospedagem Ideal:** Vercel ou Netlify.
- **Destaque:** Interface focada em UX, com carregamento rápido e feedback visual imediato.

### 4.2. Backend (O Motor)
- **Tecnologia:** Node.js.
- **Linguagem:** TypeScript.
- **ORM:** Prisma (garante tipagem segura e queries otimizadas).
- **Banco de Dados:** PostgreSQL 15 (Relacional, robusto para dados financeiros).
- **Hospedagem Ideal:** Render, Railway ou VPS Dockerizada.

### 4.3. Infraestrutura e DevOps
- **Docker:** Ambientes de desenvolvimento e produção padronizados via `docker-compose`.
- **CI/CD:** Pipelines do GitHub Actions garantem que nenhum código quebrado chegue em produção (testes de build automáticos).

---

## 5. Integrações Externas

### 5.1. Google Drive API
Utilizada para a leitura dos arquivos de laudo. O sistema atua como um "observador", baixando e processando arquivos assim que são sincronizados pelas lojas.

### 5.2. Servidor SMTP
Integração para o envio transacional de relatórios e alertas. Configurável para usar serviços como SendGrid, AWS SES ou SMTP corporativo padrão.

---

## 6. Segurança e Confiabilidade
- **Dados Sensíveis:** Credenciais e chaves de API gerenciadas via variáveis de ambiente (`.env`), nunca expostas no código.
- **Tipagem Forte:** O uso de TypeScript no Fullstack reduz drasticamente bugs de runtime.
- **Backup:** A estrutura em Docker facilita rotinas de backup do banco de dados PostgreSQL.

---

## 7. Conclusão
O **Financeiro Prátika Vistorias** não é apenas um sistema de registro, é uma plataforma de **inteligência operacional**. Ele transforma dados brutos (PDFs) em insights financeiros e de performance, permitindo que a gestão foque em crescimento ao invés de microgerenciamento de planilhas.
