# 🛡️ Relatório de Auditoria de Segurança - Prátika Vistorias

**Data:** 28/11/2025
**Auditor:** Anti Gravity (Security Engineer)
**Escopo:** Backend, Workers, Database, Infrastructure

---

## 📊 Resumo Executivo

O sistema apresenta uma base sólida com boas práticas de desenvolvimento (TypeScript, Prisma, Zod), mas carece de camadas de defesa em profundidade essenciais para um ambiente de produção seguro. A ausência de headers de segurança, rate limiting e uma política de CORS restritiva expõe a API a ataques comuns.

**Score de Segurança:** 🛡️ **B-** (Bom, mas requer ajustes antes de ir para produção)

---

## 🚨 Vulnerabilidades Identificadas

### 🔴 Críticas (Ação Imediata)
*   **Nenhuma vulnerabilidade crítica (RCE, SQLi direto) foi encontrada.** O uso do Prisma ORM e Zod Validation mitiga a maioria dos riscos de injeção.

### 🟠 Alta Prioridade (Corrigir no Sprint Atual)
1.  **CORS Permissivo (`origin: '*'`)**
    *   **Risco:** Permite que qualquer site faça requisições para sua API, facilitando ataques CSRF e roubo de dados.
    *   **Correção:** Restringir `origin` para o domínio do frontend (ex: `https://app.pratika.com`).
2.  **Ausência de Security Headers (Helmet)**
    *   **Risco:** Deixa a API vulnerável a XSS, Clickjacking e Sniffing.
    *   **Correção:** Implementar `@fastify/helmet`.
3.  **Falta de Rate Limiting**
    *   **Risco:** API suscetível a ataques de Brute-Force (login) e DDoS (relatórios/drive).
    *   **Correção:** Implementar `@fastify/rate-limit`.
4.  **Segredo JWT com Fallback Inseguro**
    *   **Risco:** O código usa `'default-secret'` se a variável de ambiente falhar. Se isso for para produção, os tokens podem ser forjados.
    *   **Correção:** Remover o fallback e lançar erro fatal se `JWT_SECRET` não estiver definido.

### 🟡 Moderada Prioridade (Planejar para Próximo Sprint)
1.  **Sanitização de Nomes de Arquivo (Drive Worker)**
    *   **Risco:** Arquivos com nomes maliciosos no Google Drive poderiam teoricamente causar Path Traversal ao salvar no disco local.
    *   **Correção:** Sanitizar `file.name` antes de usar em `path.join`.
2.  **Gerenciamento de Sessão (Refresh Tokens)**
    *   **Risco:** Tokens JWT de longa duração aumentam a janela de oportunidade em caso de roubo.
    *   **Correção:** Implementar fluxo de Refresh Token e reduzir tempo de vida do Access Token.
3.  **Logs Sensíveis**
    *   **Risco:** O logger padrão pode expor dados sensíveis em caso de erro.
    *   **Correção:** Implementar redação de dados sensíveis (senhas, tokens) nos logs.

---

## 🔒 Recomendações de Zero Trust & IAM

### IAM (Identity and Access Management)
*   **Google Cloud Service Account:**
    *   Criar uma Service Account dedicada para o `DriveWatcher` com permissão **apenas de leitura** na pasta específica do Drive. Não usar credenciais de admin total.
*   **Database Roles:**
    *   O backend conecta como superusuário (`postgres`). Recomendado criar um usuário de aplicação com permissões apenas de DML (SELECT, INSERT, UPDATE, DELETE) nas tabelas do schema `public`.

### Zero Trust
*   **Validação Contínua:** O middleware de autenticação já valida o token a cada requisição, o que é bom.
*   **Rede:** Em produção, o banco de dados não deve ter porta exposta publicamente (apenas acessível via rede interna do Docker/VPC).

---

## 🛠️ Plano de Ação (Patch Sugerido)

### 1. Instalar Pacotes de Segurança
```bash
npm install @fastify/helmet @fastify/rate-limit
```

### 2. Hardening do Server (`server.ts`)
```typescript
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';

// ...

app.register(helmet);

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute'
});

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Restrito
});
```

### 3. Hardening do Auth Middleware
```typescript
if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET not defined');
}
```

---

## ✅ Conclusão
O sistema está funcional e bem estruturado. Com a aplicação dos patches de segurança sugeridos acima (especialmente CORS, Helmet e Rate Limit), ele atingirá um nível de maturidade adequado para operação segura.
