import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { TipoServico, StatusPagamento, FormaPagamento } from '@prisma/client';

export async function createServico(request: FastifyRequest, reply: FastifyReply) {
  const createServicoBody = z.object({
    data_hora: z.string().datetime(), // Expect ISO string
    loja_id: z.string().uuid().optional(),
    cliente_particular_id: z.string().uuid().optional(),
    perito_id: z.string().uuid(),
    placa_veiculo: z.string(),
    tipo: z.nativeEnum(TipoServico),
    valor: z.coerce.number(),
    status_pagamento: z.nativeEnum(StatusPagamento).optional(),
    forma_pagamento: z.nativeEnum(FormaPagamento).optional(),
    observacoes: z.string().optional(),
  });

  const data = createServicoBody.parse(request.body);

  const servico = await prisma.servico.create({
    data: {
      ...data,
      data_hora: new Date(data.data_hora),
    },
  });

  return reply.status(201).send(servico);
}

export async function listServicos(request: FastifyRequest, reply: FastifyReply) {
  const servicos = await prisma.servico.findMany({
    include: {
      loja: true,
      perito: true,
      cliente_particular: true,
    },
    orderBy: {
      data_hora: 'desc',
    },
  });

  return reply.send(servicos);
}

export async function getServico(request: FastifyRequest, reply: FastifyReply) {
  const getServicoParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getServicoParams.parse(request.params);

  const servico = await prisma.servico.findUnique({
    where: { id },
    include: {
      loja: true,
      perito: true,
      cliente_particular: true,
    },
  });

  if (!servico) {
    return reply.status(404).send({ message: 'Servico not found' });
  }

  return reply.send(servico);
}

export async function updateServico(request: FastifyRequest, reply: FastifyReply) {
  const getServicoParams = z.object({
    id: z.string().uuid(),
  });

  const updateServicoBody = z.object({
    data_hora: z.string().datetime().optional(),
    loja_id: z.string().uuid().optional(),
    cliente_particular_id: z.string().uuid().optional(),
    perito_id: z.string().uuid().optional(),
    placa_veiculo: z.string().optional(),
    tipo: z.nativeEnum(TipoServico).optional(),
    valor: z.coerce.number().optional(),
    status_pagamento: z.nativeEnum(StatusPagamento).optional(),
    forma_pagamento: z.nativeEnum(FormaPagamento).optional(),
    observacoes: z.string().optional(),
  });

  const { id } = getServicoParams.parse(request.params);
  const data = updateServicoBody.parse(request.body);

  try {
    const servico = await prisma.servico.update({
      where: { id },
      data: {
        ...data,
        data_hora: data.data_hora ? new Date(data.data_hora) : undefined,
      },
    });
    return reply.send(servico);
  } catch (error) {
    return reply.status(404).send({ message: 'Servico not found' });
  }
}

export async function deleteServico(request: FastifyRequest, reply: FastifyReply) {
  const getServicoParams = z.object({
    id: z.string().uuid(),
  });

  const { id } = getServicoParams.parse(request.params);

  try {
    await prisma.servico.delete({
      where: { id },
    });
    return reply.status(204).send();
  } catch (error) {
    return reply.status(404).send({ message: 'Servico not found' });
  }
}
