const FastifySchema = (fastify, options) => {
  fastify.addSchema({
    $id: 'auth.login.schema',
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'instance.create.schema',
    type: 'object',
    required: ['instanceName', 'instanceOwner', 'type'],
    properties: {
      instanceName: { type: 'string' },
      instanceOwner: { type: 'string' },
      type: { type: 'string' },
      environment: { type: 'object', properties: {} },
      limits: { type: 'object', properties: {} },
    },
  });
};

module.exports = FastifySchema;
