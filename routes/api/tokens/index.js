const { randomUUID } = require('node:crypto');

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ tokenId: randomUUID(), permissions: {} });
  });
  fastify.post('/', async (request, reply) => {
    return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
  });

  fastify.get('/:tokenId', async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost Token API is opened' });
  });

  fastify.post('/:tokenId', async (request, reply) => {
    return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
  });

  fastify.delete('/:tokenId', async (request, reply) => {
    return reply.status(204).send();
  });
};

module.exports = APIRoute;
