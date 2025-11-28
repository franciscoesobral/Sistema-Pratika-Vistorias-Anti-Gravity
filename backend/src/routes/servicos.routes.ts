import { FastifyInstance } from 'fastify';
import { createServico, deleteServico, getServico, listServicos, updateServico } from '../controllers/ServicosController';

export async function servicosRoutes(app: FastifyInstance) {
  app.post('/servicos', createServico);
  app.get('/servicos', listServicos);
  app.get('/servicos/:id', getServico);
  app.put('/servicos/:id', updateServico);
  app.delete('/servicos/:id', deleteServico);
}
