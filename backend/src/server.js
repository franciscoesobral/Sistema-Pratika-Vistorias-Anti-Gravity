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
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const client_1 = require("@prisma/client");
const app = (0, fastify_1.default)({
    logger: true,
});
const prisma = new client_1.PrismaClient();
app.register(cors_1.default, {
    origin: '*', // Adjust in production
});
const lojas_routes_1 = require("./routes/lojas.routes");
const peritos_routes_1 = require("./routes/peritos.routes");
const servicos_routes_1 = require("./routes/servicos.routes");
const financeiro_routes_1 = require("./routes/financeiro.routes");
const auth_routes_1 = require("./routes/auth.routes");
app.register(lojas_routes_1.lojasRoutes);
app.register(peritos_routes_1.peritosRoutes);
app.register(servicos_routes_1.servicosRoutes);
app.register(financeiro_routes_1.financeiroRoutes);
app.register(auth_routes_1.authRoutes);
app.get('/health', (request, reply) => __awaiter(void 0, void 0, void 0, function* () {
    return { status: 'ok', timestamp: new Date() };
}));
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield app.listen({ port: 3333, host: '0.0.0.0' });
        console.log('Server running on http://localhost:3333');
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
});
start();
