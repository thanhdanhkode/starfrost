const {
  createInstance,
  getAllInstances,
  getInstanceById,
  powerInstance,
  commandInstance,
  deleteInstance,
} = require('../../../controllers/instance.controller');

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

const powerOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['action'],
      properties: {
        action: { type: 'string' },
      },
    },
  },
};

const commandOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['command'],
      properties: {
        command: { type: 'string' },
      },
    },
  },
};

const nameOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        name: { type: 'string' },
      },
    },
  },
};

const descriptionOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['description'],
      properties: {
        description: { type: 'string' },
      },
    },
  },
};

const limitOptions = {
  schema: {
    body: {
      type: 'object',
      required: ['limits'],
      properties: {
        limits: {
          type: 'object',
          properties: {
            cpu: { type: 'number' },
            ram: { type: 'number' },
            disk: { type: 'number' },
            backup: { type: 'number' },
          },
        },
      },
    },
  },
};

const InstanceAPIRoute = (fastify, option) => {
  fastify.get('/', getAllInstances);

  fastify.post('/', options, createInstance);

  fastify.get('/:instanceId', getInstanceById);

  fastify.delete('/:instanceId', deleteInstance);

  fastify.post('/:instanceId/power', powerOptions, powerInstance);

  fastify.post('/:instanceId/command', commandOptions, commandInstance);

  fastify.get('/:instanceId/websocket', { websocket: true }, async (socket, request) => {
    const { instanceId } = request.params;
    socket.on('message', (message) => {
      socket.send('[Starfrost] ' + message);
    });
  });

  fastify.get('/:instanceId/resources', async (request, reply) => {
    const { instanceId } = request.params;

    const data = await reply.server.instance.resource({ instanceId });
    fastify.log.info(data);

    return reply.send();
  });

  fastify.get('/:instanceId/settings', async (request, reply) => {
    const { instanceId } = request.params;

    return reply.status(200).send({ message: 'Settings retrieved successfully' });
  });

  fastify.post('/:instanceId/settings/name', nameOptions, async (request, reply) => {
    const { instanceId } = request.params;
    const { name } = request.body;

    return reply.status(204).send();
  });

  fastify.post('/:instanceId/settings/description', descriptionOptions, async (request, reply) => {
    const { instanceId } = request.params;
    const { description } = request.body;

    return reply.status(204).send();
  });

  fastify.post('/:instanceId/settings/limits', limitOptions, async (request, reply) => {
    const { instanceId } = request.params;
    const { limits } = request.body;

    return reply.status(204).send();
  });
};

module.exports = InstanceAPIRoute;
