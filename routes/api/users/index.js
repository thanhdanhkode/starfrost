const { randomBytes, randomUUID } = require('node:crypto');
const { getAllUsers, createUser, getUserById } = require('../../../controllers/user.controller');

const userOptions = {
  schema: {
    body: {
      type: 'object',
      properties: {
        username: { type: 'string' },
        password: { type: 'string' },
        role: { type: 'string' },
        email: { type: 'string', format: 'email' },
      },
      required: ['username', 'email'],
    },
  },
};

const UserAPIRoute = (fastify, option) => {
  fastify.get('/', getAllUsers);

  fastify.post('/', userOptions, createUser);

  fastify.get('/:userId', getUserById);

  fastify.post('/:userId', async (request, reply) => {
    const { userId } = request.params;
    const { username, email } = request.body;
    return reply.status(201).send({ userId, username, email });
  });

  fastify.delete('/:userId', async (request, reply) => {
    const { userId } = request.params;
    return reply.status(204).send();
  });
};

module.exports = UserAPIRoute;
