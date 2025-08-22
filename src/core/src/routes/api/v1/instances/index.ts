import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { randomUUID } from 'node:crypto';

const options = {
	schema: {
		body: {
			type: 'object',
			required: ['instanceName', 'instanceOwner', 'type'],
			properties: {
				instanceName: { type: 'string' },
				instanceOwner: { type: 'string' },
				type: { type: 'string' },
				environment: { type: 'object', properties: {} },
				limits: { type: 'object', properties: {} },
			},
		},
	},
};

type InstanceRequestBody = {
	instanceName: string;
	instanceOwner: string;
	type: string;
	environment: Record<string, unknown>;
	limits: Record<string, unknown>;
};

const APIRoute = (fastify: FastifyInstance, option: any) => {
	fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
		return reply.status(200).send({ message: 'Starfrost Instance API is opened' });
	});

	fastify.post('/', options, async (request: FastifyRequest, reply: FastifyReply) => {
		const { instanceName, instanceOwner, type, environment, limits } = request.body as InstanceRequestBody;

		const uuid = randomUUID();
		const now = new Date().toISOString();
		const later = new Date(Date.now() + 60 * 60 * 1000).toISOString();

		return reply.status(200).send({
			instanceName: instanceName,
			instanceOwner: instanceOwner,
			type: type,
			uuid: `${uuid}`,
			environment: environment,
			limits: limits,
			createdAt: `${now}`,
			updateAt: `${later}`,
		});
	});
};

export default APIRoute;
