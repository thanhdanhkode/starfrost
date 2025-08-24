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

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost Instance API is opened' });
  });

  fastify.post('/', options, async (request, reply) => {
    const { instanceName, instanceOwner, type, environment, limits } = request.body;

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
