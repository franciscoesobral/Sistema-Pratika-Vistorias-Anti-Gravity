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
exports.createServico = createServico;
exports.listServicos = listServicos;
exports.getServico = getServico;
exports.updateServico = updateServico;
exports.deleteServico = deleteServico;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
function createServico(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createServicoBody = zod_1.z.object({
            data_hora: zod_1.z.string().datetime(), // Expect ISO string
            loja_id: zod_1.z.string().uuid().optional(),
            cliente_particular_id: zod_1.z.string().uuid().optional(),
            perito_id: zod_1.z.string().uuid(),
            placa_veiculo: zod_1.z.string(),
            tipo: zod_1.z.nativeEnum(client_1.TipoServico),
            valor: zod_1.z.number(),
            status_pagamento: zod_1.z.nativeEnum(client_1.StatusPagamento).optional(),
            forma_pagamento: zod_1.z.nativeEnum(client_1.FormaPagamento).optional(),
            observacoes: zod_1.z.string().optional(),
        });
        const data = createServicoBody.parse(request.body);
        const servico = yield prisma_1.prisma.servicos.create({
            data: Object.assign(Object.assign({}, data), { data_hora: new Date(data.data_hora) }),
        });
        return reply.status(201).send(servico);
    });
}
function listServicos(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const servicos = yield prisma_1.prisma.servicos.findMany({
            include: {
                loja: true,
                perito: true,
                cliente_particular: true,
            },
            orderBy: {
                data_hora: 'desc',
            },
        });
        return reply.send(servicos);
    });
}
function getServico(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getServicoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getServicoParams.parse(request.params);
        const servico = yield prisma_1.prisma.servicos.findUnique({
            where: { id },
            include: {
                loja: true,
                perito: true,
                cliente_particular: true,
            },
        });
        if (!servico) {
            return reply.status(404).send({ message: 'Servico not found' });
        }
        return reply.send(servico);
    });
}
function updateServico(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getServicoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const updateServicoBody = zod_1.z.object({
            data_hora: zod_1.z.string().datetime().optional(),
            loja_id: zod_1.z.string().uuid().optional(),
            cliente_particular_id: zod_1.z.string().uuid().optional(),
            perito_id: zod_1.z.string().uuid().optional(),
            placa_veiculo: zod_1.z.string().optional(),
            tipo: zod_1.z.nativeEnum(client_1.TipoServico).optional(),
            valor: zod_1.z.number().optional(),
            status_pagamento: zod_1.z.nativeEnum(client_1.StatusPagamento).optional(),
            forma_pagamento: zod_1.z.nativeEnum(client_1.FormaPagamento).optional(),
            observacoes: zod_1.z.string().optional(),
        });
        const { id } = getServicoParams.parse(request.params);
        const data = updateServicoBody.parse(request.body);
        try {
            const servico = yield prisma_1.prisma.servicos.update({
                where: { id },
                data: Object.assign(Object.assign({}, data), { data_hora: data.data_hora ? new Date(data.data_hora) : undefined }),
            });
            return reply.send(servico);
        }
        catch (error) {
            return reply.status(404).send({ message: 'Servico not found' });
        }
    });
}
function deleteServico(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getServicoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getServicoParams.parse(request.params);
        try {
            yield prisma_1.prisma.servicos.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(404).send({ message: 'Servico not found' });
        }
    });
}
