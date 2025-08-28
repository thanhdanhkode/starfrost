const { Login, Logout, ForgotPwd } = require('./../../../controllers/auth.controller');

const verify = (request, reply, done) => {
  const cookie = request.cookies;

  done();
};

const AuthAPIRoute = (fastify, options) => {
  fastify.decorate('verify', verify);

  fastify.get('/', { preHandler: fastify.auth([fastify.verify]) }, async (request, reply) => {
    return reply.status(200).send({ message: 'Auth API is opened' });
  });

  fastify.post('/login', {}, Login);

  fastify.get('/logout', {}, Logout);

  fastify.get('/forgot-pwd', {}, ForgotPwd);
};

module.exports = AuthAPIRoute;
