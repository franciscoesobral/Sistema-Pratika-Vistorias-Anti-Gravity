import { FastifyInstance } from 'fastify';
import { authenticate, register } from '../controllers/AuthController';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', register);
  app.post('/auth/login', authenticate);
}
