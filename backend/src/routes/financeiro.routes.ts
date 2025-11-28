import { FastifyInstance } from 'fastify';
import {
  createContaReceber,
  listContasReceber,
  updateContaReceber,
  createContaPagar,
  listContasPagar,
  updateContaPagar,
} from '../controllers/FinanceiroController';

export async function financeiroRoutes(app: FastifyInstance) {
  // Contas a Receber
  app.post('/financeiro/receber', createContaReceber);
  app.get('/financeiro/receber', listContasReceber);
  app.put('/financeiro/receber/:id', updateContaReceber);

  // Contas a Pagar
  app.post('/financeiro/pagar', createContaPagar);
  app.get('/financeiro/pagar', listContasPagar);
  app.put('/financeiro/pagar/:id', updateContaPagar);
}
