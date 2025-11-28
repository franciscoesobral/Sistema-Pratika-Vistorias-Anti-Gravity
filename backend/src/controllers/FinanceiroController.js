"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContaReceber = createContaReceber;
exports.listContasReceber = listContasReceber;
exports.updateContaReceber = updateContaReceber;
exports.createContaPagar = createContaPagar;
exports.listContasPagar = listContasPagar;
exports.updateContaPagar = updateContaPagar;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// -- Contas a Receber --
function createContaReceber(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createContaReceberBody = zod_1.z.object({
            referencia_servico_id: zod_1.z.string().uuid().optional(),
            loja_id: zod_1.z.string().uuid().optional(),
            cliente_particular_id: zod_1.z.string().uuid().optional(),
            descricao: zod_1.z.string().optional(),
            valor_total: zod_1.z.number(),
            data_emissao: zod_1.z.string().datetime(),
            data_vencimento: zod_1.z.string().datetime(),
            status: zod_1.z.nativeEnum(client_1.StatusConta).optional(),
        });
        const data = createContaReceberBody.parse(request.body);
        const conta = yield prisma_1.prisma.contasReceber.create({
            data: Object.assign(Object.assign({}, data), { data_emissao: new Date(data.data_emissao), data_vencimento: new Date(data.data_vencimento) }),
        });
        return reply.status(201).send(conta);
    });
}
function listContasReceber(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const contas = yield prisma_1.prisma.contasReceber.findMany({
            include: {
                loja: true,
                cliente_particular: true,
                referencia_servico: true,
            },
            orderBy: {
                data_vencimento: 'asc',
            },
        });
        return reply.send(contas);
    });
}
function updateContaReceber(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getParams = zod_1.z.object({ id: zod_1.z.string().uuid() });
        const updateBody = zod_1.z.object({
            descricao: zod_1.z.string().optional(),
            valor_total: zod_1.z.number().optional(),
            data_vencimento: zod_1.z.string().datetime().optional(),
            data_pagamento: zod_1.z.string().datetime().optional(),
            status: zod_1.z.nativeEnum(client_1.StatusConta).optional(),
            url_nf: zod_1.z.string().optional(),
            url_boleto: zod_1.z.string().optional(),
            url_comprovante: zod_1.z.string().optional(),
        });
        const { id } = getParams.parse(request.params);
        const data = updateBody.parse(request.body);
        try {
            const conta = yield prisma_1.prisma.contasReceber.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : undefined, data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : undefined }),
            });
            return reply.send(conta);
        }
        catch (error) {
            return reply.status(404).send({ message: 'Conta a receber not found' });
        }
    });
}
// -- Contas a Pagar --
function createContaPagar(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createBody = zod_1.z.object({
            descricao: zod_1.z.string(),
            categoria: zod_1.z.string(),
            fornecedor: zod_1.z.string().optional(),
            valor: zod_1.z.number(),
            data_vencimento: zod_1.z.string().datetime(),
            status: zod_1.z.nativeEnum(client_1.StatusConta).optional(),
        });
        const data = createBody.parse(request.body);
        const conta = yield prisma_1.prisma.contasPagar.create({
            data: Object.assign(Object.assign({}, data), { data_vencimento: new Date(data.data_vencimento) }),
        });
        return reply.status(201).send(conta);
    });
}
function listContasPagar(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const contas = yield prisma_1.prisma.contasPagar.findMany({
            orderBy: {
                data_vencimento: 'asc',
            },
        });
        return reply.send(contas);
    });
}
function updateContaPagar(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getParams = zod_1.z.object({ id: zod_1.z.string().uuid() });
        const updateBody = zod_1.z.object({
            descricao: zod_1.z.string().optional(),
            categoria: zod_1.z.string().optional(),
            fornecedor: zod_1.z.string().optional(),
            valor: zod_1.z.number().optional(),
            data_vencimento: zod_1.z.string().datetime().optional(),
            data_pagamento: zod_1.z.string().datetime().optional(),
            status: zod_1.z.nativeEnum(client_1.StatusConta).optional(),
            url_nf: zod_1.z.string().optional(),
            url_boleto: zod_1.z.string().optional(),
            url_comprovante: zod_1.z.string().optional(),
        });
        const { id } = getParams.parse(request.params);
        const data = updateBody.parse(request.body);
        try {
            const conta = yield prisma_1.prisma.contasPagar.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : undefined, data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : undefined }),
            });
            return reply.send(conta);
        }
        catch (error) {
            return reply.status(404).send({ message: 'Conta a pagar not found' });
        }
    });
}
