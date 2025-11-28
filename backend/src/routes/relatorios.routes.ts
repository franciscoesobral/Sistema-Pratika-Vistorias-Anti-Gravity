import { FastifyInstance } from 'fastify';
import { RelatoriosController } from '../controllers/RelatoriosController';
import { authMiddleware } from '../middlewares/authMiddleware';

const relatoriosController = new RelatoriosController();

export async function relatoriosRoutes(app: FastifyInstance) {
  app.addHook('preHandler', authMiddleware);

  app.get('/relatorios/lojas/:format', relatoriosController.downloadLojas);
  app.get('/relatorios/financeiro/:tipo/:format', relatoriosController.downloadFinanceiro);
}
