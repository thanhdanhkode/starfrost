import { randomUUID } from 'node:crypto';

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ tokenId: randomUUID(), permissions: {} });
  });
  fastify.post('/', async (request, reply) => {
    return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
  });
};

export default APIRoute;
