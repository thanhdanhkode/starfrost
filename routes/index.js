const DefaultRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost is opened' });
  });
};

module.exports = DefaultRoute;
