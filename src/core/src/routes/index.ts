import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const DefaultRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({ message: 'Starfrost is opened' });
	});
};

export default DefaultRoute;
