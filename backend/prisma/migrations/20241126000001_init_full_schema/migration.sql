-- CreateEnum
CREATE TYPE "StatusPagamento" AS ENUM ('pago', 'em_aberto', 'vencido', 'isento', 'cortesia');

-- CreateEnum
CREATE TYPE "FormaPagamento" AS ENUM ('dinheiro', 'pix', 'cartao', 'boleto', 'faturado');

-- CreateEnum
CREATE TYPE "StatusConta" AS ENUM ('em_aberto', 'pago', 'atrasado', 'negociado');

-- CreateEnum
CREATE TYPE "TipoServico" AS ENUM ('pericia', 'consulta', 'atualizacao', 'outros');

-- CreateEnum
CREATE TYPE "PeriodoMeta" AS ENUM ('mensal', 'semanal');

-- CreateTable
CREATE TABLE "lojas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT,
    "contato" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lojas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peritos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "peritos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clientes_particulares" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT,
    "telefone" TEXT,
    "email" TEXT,
    "origem" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_particulares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "servicos" (
    "id" TEXT NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "loja_id" TEXT,
    "cliente_particular_id" TEXT,
    "perito_id" TEXT NOT NULL,
    "placa_veiculo" TEXT NOT NULL,
    "tipo" "TipoServico" NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status_pagamento" "StatusPagamento" NOT NULL DEFAULT 'em_aberto',
    "forma_pagamento" "FormaPagamento",
    "observacoes" TEXT,
    "drive_file_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servicos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_receber" (
    "id" TEXT NOT NULL,
    "referencia_servico_id" TEXT,
    "loja_id" TEXT,
    "cliente_particular_id" TEXT,
    "descricao" TEXT,
    "valor_total" DECIMAL(10,2) NOT NULL,
    "data_emissao" TIMESTAMP(3) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "status" "StatusConta" NOT NULL DEFAULT 'em_aberto',
    "url_nf" TEXT,
    "url_boleto" TEXT,
    "url_comprovante" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contas_receber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contas_pagar" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "fornecedor" TEXT,
    "valor" DECIMAL(10,2) NOT NULL,
    "data_vencimento" TIMESTAMP(3) NOT NULL,
    "data_pagamento" TIMESTAMP(3),
    "status" "StatusConta" NOT NULL DEFAULT 'em_aberto',
    "url_nf" TEXT,
    "url_boleto" TEXT,
    "url_comprovante" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contas_pagar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metas" (
    "id" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "referencia_id" TEXT,
    "periodo" "PeriodoMeta" NOT NULL,
    "meta_pericias" INTEGER,
    "meta_faturamento" DECIMAL(10,2),
    "data_inicio" TIMESTAMP(3) NOT NULL,
    "data_fim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gamificacao_historico" (
    "id" TEXT NOT NULL,
    "perito_id" TEXT NOT NULL,
    "periodo_inicio" TIMESTAMP(3) NOT NULL,
    "periodo_fim" TIMESTAMP(3) NOT NULL,
    "tipo_periodo" "PeriodoMeta" NOT NULL,
    "pontos_total" INTEGER NOT NULL DEFAULT 0,
    "pericias_realizadas" INTEGER NOT NULL DEFAULT 0,
    "consultas_realizadas" INTEGER NOT NULL DEFAULT 0,
    "atualizacoes_realizadas" INTEGER NOT NULL DEFAULT 0,
    "posicao_rank" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gamificacao_historico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "peritos_email_key" ON "peritos"("email");

-- CreateIndex
CREATE UNIQUE INDEX "contas_receber_referencia_servico_id_key" ON "contas_receber"("referencia_servico_id");

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "lojas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_cliente_particular_id_fkey" FOREIGN KEY ("cliente_particular_id") REFERENCES "clientes_particulares"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servicos" ADD CONSTRAINT "servicos_perito_id_fkey" FOREIGN KEY ("perito_id") REFERENCES "peritos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_referencia_servico_id_fkey" FOREIGN KEY ("referencia_servico_id") REFERENCES "servicos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_loja_id_fkey" FOREIGN KEY ("loja_id") REFERENCES "lojas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contas_receber" ADD CONSTRAINT "contas_receber_cliente_particular_id_fkey" FOREIGN KEY ("cliente_particular_id") REFERENCES "clientes_particulares"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gamificacao_historico" ADD CONSTRAINT "gamificacao_historico_perito_id_fkey" FOREIGN KEY ("perito_id") REFERENCES "peritos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
