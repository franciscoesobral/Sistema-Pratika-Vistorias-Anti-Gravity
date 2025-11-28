import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBody = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['ADMIN', 'OPERADOR', 'PERITO', 'LOJA']).optional(),
  });

  const { name, email, password, role } = registerBody.parse(request.body);

  const password_hash = await bcrypt.hash(password, 6);

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return reply.status(409).send({ message: 'User already exists.' });
  }

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash,
      role: role || 'OPERADOR',
    },
  });

  return reply.status(201).send();
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authenticateBody = z.object({
    email: z.string().email(),
    password: z.string(),
  });

  const { email, password } = authenticateBody.parse(request.body);

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return reply.status(400).send({ message: 'Invalid credentials.' });
  }

  const doesPasswordMatch = await bcrypt.compare(password, user.password_hash);

  if (!doesPasswordMatch) {
    return reply.status(400).send({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    {
      role: user.role,
    },
    process.env.JWT_SECRET || 'default-secret',
    {
      subject: user.id,
      expiresIn: '7d',
    }
  );

  return reply.status(200).send({
    token,
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
