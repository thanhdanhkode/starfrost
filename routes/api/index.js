const APIRoute = (fastify, option) => {
  fastify.get('/', { preHandler: fastify.auth([fastify.verifyBearerAuth]) }, async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost API is opened' });
  });
};

module.exports = APIRoute;
