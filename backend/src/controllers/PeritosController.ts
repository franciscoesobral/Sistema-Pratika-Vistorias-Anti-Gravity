import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';

export async function createPerito(request: FastifyRequest, reply: FastifyReply) {
  const createPeritoBody = z.object({
    nome: z.string(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
  });

  const data = createPeritoBody.parse(request.body);

  const perito = await prisma.perito.create({
    data,
  });

  return reply.status(201).send(perito);
}

export async function listPeritos(request: FastifyRequest, reply: FastifyReply) {
  const peritos = await prisma.perito.findMany({
    orderBy: {
      nome: 'asc',
    },
  });

  return reply.send(peritos);
}

export async function getPerito(request: FastifyRequest, reply: FastifyReply) {
  const getPeritoParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getPeritoParams.parse(request.params);

  const perito = await prisma.perito.findUnique({
    where: { id },
  });

  if (!perito) {
    return reply.status(404).send({ message: 'Perito not found' });
  }

  return reply.send(perito);
}

export async function updatePerito(request: FastifyRequest, reply: FastifyReply) {
  const getPeritoParams = z.object({
    id: z.string().uuid(),
  });

  const updatePeritoBody = z.object({
    nome: z.string().optional(),
    email: z.string().email().optional(),
    telefone: z.string().optional(),
    ativo: z.boolean().optional(),
  });

  const { id } = getPeritoParams.parse(request.params);
  const data = updatePeritoBody.parse(request.body);

  try {
    const perito = await prisma.perito.update({
      where: { id },
      data,
    });
    return reply.send(perito);
  } catch (error) {
    return reply.status(404).send({ message: 'Perito not found' });
  }
}

export async function deletePerito(request: FastifyRequest, reply: FastifyReply) {
  const getPeritoParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getPeritoParams.parse(request.params);

  try {
    await prisma.perito.delete({
      where: { id },
    });
    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ message: 'Perito not found' });
  }
}
