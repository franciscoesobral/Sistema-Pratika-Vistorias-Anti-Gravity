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
exports.createPerito = createPerito;
exports.listPeritos = listPeritos;
exports.getPerito = getPerito;
exports.updatePerito = updatePerito;
exports.deletePerito = deletePerito;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
function createPerito(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const createPeritoBody = zod_1.z.object({
            nome: zod_1.z.string(),
            email: zod_1.z.string().email().optional(),
            telefone: zod_1.z.string().optional(),
        });
        const data = createPeritoBody.parse(request.body);
        const perito = yield prisma_1.prisma.peritos.create({
            data,
        });
        return reply.status(201).send(perito);
    });
}
function listPeritos(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const peritos = yield prisma_1.prisma.peritos.findMany({
            orderBy: {
                nome: 'asc',
            },
        });
        return reply.send(peritos);
    });
}
function getPerito(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getPeritoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getPeritoParams.parse(request.params);
        const perito = yield prisma_1.prisma.peritos.findUnique({
            where: { id },
        });
        if (!perito) {
            return reply.status(404).send({ message: 'Perito not found' });
        }
        return reply.send(perito);
    });
}
function updatePerito(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getPeritoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const updatePeritoBody = zod_1.z.object({
            nome: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            telefone: zod_1.z.string().optional(),
            ativo: zod_1.z.boolean().optional(),
        });
        const { id } = getPeritoParams.parse(request.params);
        const data = updatePeritoBody.parse(request.body);
        try {
            const perito = yield prisma_1.prisma.peritos.update({
                where: { id },
                data,
            });
            return reply.send(perito);
        }
        catch (error) {
            return reply.status(404).send({ message: 'Perito not found' });
        }
    });
}
function deletePerito(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const getPeritoParams = zod_1.z.object({
            id: zod_1.z.string().uuid(),
        });
        const { id } = getPeritoParams.parse(request.params);
        try {
            yield prisma_1.prisma.peritos.delete({
                where: { id },
            });
            return reply.status(204).send();
        }
        catch (error) {
            return reply.status(404).send({ message: 'Perito not found' });
        }
    });
}
