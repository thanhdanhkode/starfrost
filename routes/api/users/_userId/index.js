const { randomBytes, randomUUID } = require('node:crypto');

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({
      userId: 1,
      username: 'john_doe',
      email: 'john@example.com',
      uuid: randomUUID(),
      randomBytes: randomBytes(16).toString('hex'),
    });
  });

  fastify.post('/', async (request, reply) => {
    // const { userId } = request.params as { userId: string };
    const { username, email } = request.body;
    return reply.status(201).send({ userId: 3, username, email });
  });

  fastify.delete('/', async (request, reply) => {
    // const { userId } = request.params as { userId: string };
    return reply.status(204).send();
  });
};

module.exports = APIRoute;
