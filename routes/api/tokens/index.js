const { randomUUID } = require('node:crypto');

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ tokenId: randomUUID(), permissions: {} });
  });
  fastify.post('/', async (request, reply) => {
    return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
  });
};

module.exports = APIRoute;
