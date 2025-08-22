import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomBytes, randomUUID } from 'node:crypto';

const APIRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({
			userId: 1,
			username: 'john_doe',
			email: 'john@example.com',
			uuid: randomUUID(),
			randomBytes: randomBytes(16).toString('hex'),
		});
	});

	fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		// const { userId } = request.params as { userId: string };
		const { username, email } = request.body as { username: string; email: string };
		return reply.status(201).send({ userId: 3, username, email });
	});

	fastify.delete('/', async (request: FastifyRequest, reply: FastifyReply) => {
		// const { userId } = request.params as { userId: string };
		return reply.status(204).send();
	});
};

export default APIRoute;
