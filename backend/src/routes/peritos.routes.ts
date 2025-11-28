import { FastifyInstance } from 'fastify';
import { createPerito, deletePerito, getPerito, listPeritos, updatePerito } from '../controllers/PeritosController';

export async function peritosRoutes(app: FastifyInstance) {
  app.post('/peritos', createPerito);
  app.get('/peritos', listPeritos);
  app.get('/peritos/:id', getPerito);
  app.put('/peritos/:id', updatePerito);
  app.delete('/peritos/:id', deletePerito);
}
