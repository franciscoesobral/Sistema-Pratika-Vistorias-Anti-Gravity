-- Schema adaptado para SQLite
-- Enums são TEXT no SQLite

-- Users
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'OPERADOR',
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Lojas
CREATE TABLE lojas (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    documento TEXT,
    contato TEXT,
    telefone TEXT,
    email TEXT,
    status INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Peritos
CREATE TABLE peritos (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT UNIQUE,
    telefone TEXT,
    ativo INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Clientes Particulares
CREATE TABLE clientes_particulares (
    id TEXT PRIMARY KEY,
    nome TEXT NOT NULL,
    cpf TEXT,
    telefone TEXT,
    email TEXT,
    origem TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Servicos
CREATE TABLE servicos (
    id TEXT PRIMARY KEY,
    data_hora DATETIME NOT NULL,
    loja_id TEXT,
    cliente_particular_id TEXT,
    perito_id TEXT NOT NULL,
    placa_veiculo TEXT NOT NULL,
    tipo TEXT NOT NULL,
    valor REAL NOT NULL,
    status_pagamento TEXT DEFAULT 'em_aberto',
    forma_pagamento TEXT,
    observacoes TEXT,
    drive_file_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (loja_id) REFERENCES lojas(id),
    FOREIGN KEY (cliente_particular_id) REFERENCES clientes_particulares(id),
    FOREIGN KEY (perito_id) REFERENCES peritos(id)
);

-- Contas a Receber
CREATE TABLE contas_receber (
    id TEXT PRIMARY KEY,
    referencia_servico_id TEXT UNIQUE,
    loja_id TEXT,
    cliente_particular_id TEXT,
    descricao TEXT,
    valor_total REAL NOT NULL,
    data_emissao DATETIME NOT NULL,
    data_vencimento DATETIME NOT NULL,
    data_pagamento DATETIME,
    status TEXT DEFAULT 'em_aberto',
    url_nf TEXT,
    url_boleto TEXT,
    url_comprovante TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (referencia_servico_id) REFERENCES servicos(id),
    FOREIGN KEY (loja_id) REFERENCES lojas(id),
    FOREIGN KEY (cliente_particular_id) REFERENCES clientes_particulares(id)
);

-- Contas a Pagar
CREATE TABLE contas_pagar (
    id TEXT PRIMARY KEY,
    descricao TEXT NOT NULL,
    categoria TEXT NOT NULL,
    fornecedor TEXT,
    valor REAL NOT NULL,
    data_vencimento DATETIME NOT NULL,
    data_pagamento DATETIME,
    status TEXT DEFAULT 'em_aberto',
    url_nf TEXT,
    url_boleto TEXT,
    url_comprovante TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Metas
CREATE TABLE metas (
    id TEXT PRIMARY KEY,
    tipo TEXT NOT NULL,
    referencia_id TEXT,
    periodo TEXT NOT NULL,
    meta_pericias INTEGER,
    meta_faturamento REAL,
    data_inicio DATETIME NOT NULL,
    data_fim DATETIME NOT NULL
);

-- Gamificacao Historico
CREATE TABLE gamificacao_historico (
    id TEXT PRIMARY KEY,
    perito_id TEXT NOT NULL,
    periodo_inicio DATETIME NOT NULL,
    periodo_fim DATETIME NOT NULL,
    tipo_periodo TEXT NOT NULL,
    pontos_total INTEGER DEFAULT 0,
    pericias_realizadas INTEGER DEFAULT 0,
    consultas_realizadas INTEGER DEFAULT 0,
    atualizacoes_realizadas INTEGER DEFAULT 0,
    posicao_rank INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (perito_id) REFERENCES peritos(id)
);

-- Tabela de migrations do Prisma
CREATE TABLE _prisma_migrations (
    id TEXT PRIMARY KEY,
    checksum TEXT NOT NULL,
    finished_at DATETIME,
    migration_name TEXT NOT NULL,
    logs TEXT,
    rolled_back_at DATETIME,
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    applied_steps_count INTEGER DEFAULT 0
);
