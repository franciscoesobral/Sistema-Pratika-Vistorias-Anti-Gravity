import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import { PrismaClient } from '@prisma/client';

const app = Fastify({
  logger: true,
});

const prisma = new PrismaClient();

app.register(helmet);

app.register(rateLimit, {
  max: 100,
  timeWindow: '1 minute',
});

app.register(cors, {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
});

import { lojasRoutes } from './routes/lojas.routes';
import { peritosRoutes } from './routes/peritos.routes';
import { servicosRoutes } from './routes/servicos.routes';
import { financeiroRoutes } from './routes/financeiro.routes';
import { authRoutes } from './routes/auth.routes';

import { relatoriosRoutes } from './routes/relatorios.routes';
import { driveWatcher } from './workers/driveWatcher';
import { reportScheduler } from './workers/reportScheduler';

app.register(lojasRoutes);
app.register(peritosRoutes);
app.register(servicosRoutes);
app.register(financeiroRoutes);
app.register(authRoutes);
app.register(relatoriosRoutes);

// Start Workers
driveWatcher.start();
reportScheduler.start();

app.get('/health', async (request, reply) => {
  return { status: 'ok', timestamp: new Date() };
});

const start = async () => {
  try {
    await app.listen({ port: 3333, host: '0.0.0.0' });
    console.log('Server running on http://localhost:3333');
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
