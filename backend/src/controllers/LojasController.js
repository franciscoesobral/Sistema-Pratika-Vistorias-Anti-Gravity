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
exports.createLoja = createLoja;
exports.listLojas = listLojas;
exports.getLoja = getLoja;
exports.updateLoja = updateLoja;
exports.deleteLoja = deleteLoja;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
function createLoja(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createLojaBody = zod_1.z.object({
            nome: zod_1.z.string(),
            documento: zod_1.z.string().optional(),
            contato: zod_1.z.string().optional(),
            telefone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
        });
        const data = createLojaBody.parse(request.body);
        const loja = yield prisma_1.prisma.lojas.create({
            data,
        });
        return reply.status(201).send(loja);
    });
}
function listLojas(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const lojas = yield prisma_1.prisma.lojas.findMany({
            orderBy: {
                created_at: 'desc',
            },
        });
        return reply.send(lojas);
    });
}
function getLoja(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getLojaParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getLojaParams.parse(request.params);
        const loja = yield prisma_1.prisma.lojas.findUnique({
            where: { id },
        });
        if (!loja) {
            return reply.status(404).send({ message: 'Loja not found' });
        }
        return reply.send(loja);
    });
}
function updateLoja(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getLojaParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const updateLojaBody = zod_1.z.object({
            nome: zod_1.z.string().optional(),
            documento: zod_1.z.string().optional(),
            contato: zod_1.z.string().optional(),
            telefone: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            status: zod_1.z.boolean().optional(),
        });
        const { id } = getLojaParams.parse(request.params);
        const data = updateLojaBody.parse(request.body);
        try {
            const loja = yield prisma_1.prisma.lojas.update({
                where: { id },
                data,
            });
            return reply.send(loja);
        }
        catch (error) {
            return reply.status(404).send({ message: 'Loja not found' });
        }
    });
}
function deleteLoja(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getLojaParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getLojaParams.parse(request.params);
        try {
            yield prisma_1.prisma.lojas.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(404).send({ message: 'Loja not found' });
        }
    });
}
