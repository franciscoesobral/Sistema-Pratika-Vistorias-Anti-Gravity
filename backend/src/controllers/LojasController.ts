import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function createLoja(request: FastifyRequest, reply: FastifyReply) {
  const createLojaBody = z.object({
    nome: z.string(),
    documento: z.string().optional(),
    contato: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email().optional(),
  });

  const data = createLojaBody.parse(request.body);

  const loja = await prisma.loja.create({
    data,
  });

  return reply.status(201).send(loja);
}

export async function listLojas(request: FastifyRequest, reply: FastifyReply) {
  const lojas = await prisma.loja.findMany({
    orderBy: {
      created_at: 'desc',
    },
  });

  return reply.send(lojas);
}

export async function getLoja(request: FastifyRequest, reply: FastifyReply) {
  const getLojaParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getLojaParams.parse(request.params);

  const loja = await prisma.loja.findUnique({
    where: { id },
  });

  if (!loja) {
    return reply.status(404).send({ message: 'Loja not found' });
  }

  return reply.send(loja);
}

export async function updateLoja(request: FastifyRequest, reply: FastifyReply) {
  const getLojaParams = z.object({
    id: z.string().uuid(),
  });

  const updateLojaBody = z.object({
    nome: z.string().optional(),
    documento: z.string().optional(),
    contato: z.string().optional(),
    telefone: z.string().optional(),
    email: z.string().email().optional(),
    status: z.boolean().optional(),
  });

  const { id } = getLojaParams.parse(request.params);
  const data = updateLojaBody.parse(request.body);

  try {
    const loja = await prisma.loja.update({
      where: { id },
      data,
    });
    return reply.send(loja);
  } catch (error) {
    return reply.status(404).send({ message: 'Loja not found' });
  }
}

export async function deleteLoja(request: FastifyRequest, reply: FastifyReply) {
  const getLojaParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getLojaParams.parse(request.params);

  try {
    await prisma.loja.delete({
      where: { id },
    });
    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ message: 'Loja not found' });
  }
}
