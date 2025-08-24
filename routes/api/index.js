const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost API is opened' });
  });
};

export default APIRoute;
