import { randomUUID } from 'node:crypto';

const APIRoute = (fastify, option) => {
	fastify.get('/', async (request, reply) => {
		return reply.status(200).send({ message: 'Starfrost Token API is opened' });
	});

	fastify.post('/', async (request, reply) => {
		return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
	});

	fastify.delete('/', async (request, reply) => {
		return reply.status(204).send();
	});
};

export default APIRoute;
