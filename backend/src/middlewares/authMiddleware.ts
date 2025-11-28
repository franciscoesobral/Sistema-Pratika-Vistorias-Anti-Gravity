import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    return reply.status(401).send({ message: 'Token not provided' });
  }

  const [, token] = authHeader.split(' ');

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('FATAL: JWT_SECRET not defined');
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;

    request.user = {
      id: decoded.userId,
      role: decoded.role,
    };
  } catch (error) {
    return reply.status(401).send({ message: 'Invalid token' });
  }
}
