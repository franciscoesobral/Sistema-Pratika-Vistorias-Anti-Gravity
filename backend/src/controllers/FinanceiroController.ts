import { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { StatusConta } from '@prisma/client';

// -- Contas a Receber --

export async function createContaReceber(request: FastifyRequest, reply: FastifyReply) {
  const createContaReceberBody = z.object({
    referencia_servico_id: z.string().uuid().optional(),
    loja_id: z.string().uuid().optional(),
    cliente_particular_id: z.string().uuid().optional(),
    descricao: z.string().optional(),
    valor_total: z.coerce.number(),
    data_emissao: z.string().datetime(),
    data_vencimento: z.string().datetime(),
    status: z.nativeEnum(StatusConta).optional(),
  });

  const data = createContaReceberBody.parse(request.body);

  const conta = await prisma.contaReceber.create({
    data: {
      ...data,
      data_emissao: new Date(data.data_emissao),
      data_vencimento: new Date(data.data_vencimento),
    },
  });

  return reply.status(201).send(conta);
}

export async function listContasReceber(request: FastifyRequest, reply: FastifyReply) {
  const contas = await prisma.contaReceber.findMany({
    include: {
      loja: true,
      cliente_particular: true,
      referencia_servico: true,
    },
    orderBy: {
      data_vencimento: 'asc',
    },
  });

  return reply.send(contas);
}

export async function updateContaReceber(request: FastifyRequest, reply: FastifyReply) {
  const getParams = z.object({ id: z.string().uuid() });
  const updateBody = z.object({
    descricao: z.string().optional(),
    valor_total: z.coerce.number().optional(),
    data_vencimento: z.string().datetime().optional(),
    data_pagamento: z.string().datetime().optional(),
    status: z.nativeEnum(StatusConta).optional(),
    url_nf: z.string().optional(),
    url_boleto: z.string().optional(),
    url_comprovante: z.string().optional(),
  });

  const { id } = getParams.parse(request.params);
  const data = updateBody.parse(request.body);

  try {
    const conta = await prisma.contaReceber.update({
      where: { id },
      data: {
        ...data,
        data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : undefined,
        data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : undefined,
      },
    });
    return reply.send(conta);
  } catch (error) {
    return reply.status(404).send({ message: 'Conta a receber not found' });
  }
}

// -- Contas a Pagar --

export async function createContaPagar(request: FastifyRequest, reply: FastifyReply) {
  const createBody = z.object({
    descricao: z.string(),
    categoria: z.string(),
    fornecedor: z.string().optional(),
    valor: z.coerce.number(),
    data_vencimento: z.string().datetime(),
    status: z.nativeEnum(StatusConta).optional(),
  });

  const data = createBody.parse(request.body);

  const conta = await prisma.contaPagar.create({
    data: {
      ...data,
      data_vencimento: new Date(data.data_vencimento),
    },
  });

  return reply.status(201).send(conta);
}

export async function listContasPagar(request: FastifyRequest, reply: FastifyReply) {
  const contas = await prisma.contaPagar.findMany({
    orderBy: {
      data_vencimento: 'asc',
    },
  });

  return reply.send(contas);
}

export async function updateContaPagar(request: FastifyRequest, reply: FastifyReply) {
  const getParams = z.object({ id: z.string().uuid() });
  const updateBody = z.object({
    descricao: z.string().optional(),
    categoria: z.string().optional(),
    fornecedor: z.string().optional(),
    valor: z.coerce.number().optional(),
    data_vencimento: z.string().datetime().optional(),
    data_pagamento: z.string().datetime().optional(),
    status: z.nativeEnum(StatusConta).optional(),
    url_nf: z.string().optional(),
    url_boleto: z.string().optional(),
    url_comprovante: z.string().optional(),
  });

  const { id } = getParams.parse(request.params);
  const data = updateBody.parse(request.body);

  try {
    const conta = await prisma.contaPagar.update({
      where: { id },
      data: {
        ...data,
        data_vencimento: data.data_vencimento ? new Date(data.data_vencimento) : undefined,
        data_pagamento: data.data_pagamento ? new Date(data.data_pagamento) : undefined,
      },
    });
    return reply.send(conta);
  } catch (error) {
    return reply.status(404).send({ message: 'Conta a pagar not found' });
  }
}
