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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.authenticate = authenticate;
const prisma_1 = require("../lib/prisma");
const zod_1 = require("zod");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function register(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const registerBody = zod_1.z.object({
            name: zod_1.z.string(),
            email: zod_1.z.string().email(),
            password: zod_1.z.string().min(6),
            role: zod_1.z.enum(['ADMIN', 'OPERADOR', 'PERITO', 'LOJA']).optional(),
        });
        const { name, email, password, role } = registerBody.parse(request.body);
        const password_hash = yield bcryptjs_1.default.hash(password, 6);
        const userExists = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (userExists) {
            return reply.status(409).send({ message: 'User already exists.' });
        }
        yield prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password_hash,
                role: role || 'OPERADOR',
            },
        });
        return reply.status(201).send();
    });
}
function authenticate(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
        const authenticateBody = zod_1.z.object({
            email: zod_1.z.string().email(),
            password: zod_1.z.string(),
        });
        const { email, password } = authenticateBody.parse(request.body);
        const user = yield prisma_1.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            return reply.status(400).send({ message: 'Invalid credentials.' });
        }
        const doesPasswordMatch = yield bcryptjs_1.default.compare(password, user.password_hash);
        if (!doesPasswordMatch) {
            return reply.status(400).send({ message: 'Invalid credentials.' });
        }
        const token = jsonwebtoken_1.default.sign({
            role: user.role,
        }, process.env.JWT_SECRET || 'default-secret', {
            subject: user.id,
            expiresIn: '7d',
        });
        return reply.status(200).send({
            token,
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    });
}
