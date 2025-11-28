import { FastifyInstance } from 'fastify';
import { createLoja, deleteLoja, getLoja, listLojas, updateLoja } from '../controllers/LojasController';

export async function lojasRoutes(app: FastifyInstance) {
  app.post('/lojas', createLoja);
  app.get('/lojas', listLojas);
  app.get('/lojas/:id', getLoja);
  app.put('/lojas/:id', updateLoja);
  app.delete('/lojas/:id', deleteLoja);
}
