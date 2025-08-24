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

let instance = null;

const APIRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    // const { instanceId } = request.params as { instanceId: string };

    return reply.status(200).send({
      instanceName: 'instanceName',
      instanceOwner: 'instanceOwner',
      type: 'type',
      uuid: 'uuid',
      environment: 'environment',
      limits: 'limits',
      createdAt: 'createdAt',
      updateAt: 'updateAt',
    });
  });

  fastify.post('/power', powerOptions, async (request, reply) => {
    // const { instanceId } = request.params as { instanceId: string };
    const { action } = request.body;

    if (action === 'start') {
      if (instance) return reply.status(400).send({ error: 'Instance already running' });
    } else if (action === 'stop') {
      if (!instance) return reply.status(400).send({ error: 'Instance not running' });
    } else if (action === 'restart') {
      if (!instance) return reply.status(400).send({ error: 'Instance not running' });
    } else if (action === 'kill') {
      if (!instance) return reply.status(400).send({ error: 'Instance not running' });
    } else {
      reply.status(400).send({ error: 'Unknown action' });
    }
    return reply.status(204).send();
  });

  fastify.post('/command', commandOptions, async (request, reply) => {
    // const { instanceId } = request.params as { instanceId: string };
    const { command } = request.body;

    if (!instance) return reply.status(400).send({ error: 'Instance not running' });

    if (!command || typeof command !== 'string') return reply.status(400).send({ error: 'Invalid command' });
    return reply.status(204).send();
  });

  fastify.get('/websocket', { websocket: true }, async (socket, request) => {
    socket.on('message', (message) => {
      socket.send('[Starfrost] ' + message);
    });
  });

  fastify.get('/settings', async (request, reply) => {
    return reply.status(200).send({ message: 'Settings retrieved successfully' });
  });

  fastify.post('/settings/name', nameOptions, async (request, reply) => {
    // const { name } = request.body as { name: string };
    return reply.status(204).send();
  });

  fastify.post('/settings/description', descriptionOptions, async (request, reply) => {
    // const { description } = request.body as { description: string };
    return reply.status(204).send();
  });

  fastify.post('/settings/limits', limitOptions, async (request, reply) => {
    // const { limits } = request.body as { limits: { cpu: number; ram: number; disk: number; backup: number; } };
    return reply.status(204).send();
  });
};

export default APIRoute;
