import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomBytes, randomUUID } from 'node:crypto';

const userOptions = {
	schema: {
		body: {
			type: 'object',
			properties: {
				username: { type: 'string' },
				email: { type: 'string', format: 'email' },
			},
			required: ['username', 'email'],
		},
	},
};

const APIRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send([
			{
				userId: 1,
				username: 'john_doe',
				email: 'john@example.com',
				uuid: randomUUID(),
				randomBytes: randomBytes(16).toString('hex'),
			},
			{
				userId: 2,
				username: 'jane_doe',
				email: 'jane@example.com',
				uuid: randomUUID(),
				password: randomBytes(16).toString('hex'),
			},
		]);
	});

	fastify.post('/', userOptions, async (request: FastifyRequest, reply: FastifyReply) => {
		const { username, email } = request.body as { username: string; email: string };
		return reply
			.status(201)
			.send({ userId: 3, username, email, uuid: randomUUID(), password: randomBytes(16).toString('hex') });
	});
};

export default APIRoute;
