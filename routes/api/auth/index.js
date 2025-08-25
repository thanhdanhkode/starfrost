const AuthAPI = (fastify, options) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Auth API is opened' });
  });

  fastify.post('/login', async (request, reply) => {
    return reply.send({ message: 'Login API is opened' });
  });

  fastify.get('/logout', async (request, reply) => {
    return reply.send({ message: 'Logout API is opened' });
  });

  fastify.get('/forgot-pwd', async (request, reply) => {
    return reply.send({ message: 'Forgot Password API is opened' });
  });
};

module.exports = AuthAPI;
