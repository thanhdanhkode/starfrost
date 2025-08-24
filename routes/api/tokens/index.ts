import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';

const APIRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({ tokenId: randomUUID(), permissions: {} });
	});
	fastify.post('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(201).send({ tokenId: randomUUID(), permissions: {} });
	});
};

export default APIRoute;
