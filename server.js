const { join } = require('node:path');

const server = async (fastify, options) => {
  await fastify.register(require('@fastify/websocket'));

  await fastify.register(require('@fastify/autoload'), {
    dir: join(__dirname, 'routes'),
    forceESM: true,
    routeParams: true,
  });

  await fastify.register(require('@fastify/env'), {
    dotenv: true,
    schema: {
      type: 'object',
      properties: {
        BEARER_TOKEN_SECRET: { type: 'string' },
      },
    },
  });

  await fastify.register(require('@fastify/bearer-auth'), {
    keys: new Set([fastify.config.BEARER_TOKEN_SECRET]),
    contentType: undefined,
    bearerType: 'Bearer',
    errorResponse: (err) => {
      console.error(err);
      return { error: err.message };
    },
  });

  fastify.ready(() => {
    console.log('[Starfrost] Routes\n', fastify.printRoutes());
    // console.log('[Starfrost] Plugins \n', fastify.printPlugins());
    // console.log('[Starfrost] Environment Variables\n', fastify.getEnvs());
    console.log('[Starfrost] Ready!');
  });
};

module.exports = server;
