import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

const APIRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({ message: 'Starfrost API is opened' });
	});
};

export default APIRoute;
