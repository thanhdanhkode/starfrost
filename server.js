const { join } = require('node:path');

const server = async (fastify, options) => {
  await fastify.register(require('@fastify/websocket'));

	await fastify.register(require('@fastify/auth'), {});
  await fastify.register(require('@fastify/auth'), {});

  await fastify.register(require('@fastify/autoload'), {
    dir: join(__dirname, 'routes'),
    forceESM: true,
    routeParams: true,
  await fastify.register(require('@fastify/view'), {
    engine: { ejs: require('ejs') },
    root: join(__dirname, 'views'),
    options: {
      useHtmlMinifier: require('html-minifier-terser'),
      htmlMinifierOptions: {
        removeComments: true,
        removeCommentsFromCDATA: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
      },
    },
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
    addHook: false,
  });

  await fastify.register(require('@fastify/cookie'), {
    secret: 'your-secret-key',
    hook: 'onRequest',
    parseOptions: {},
  });

  await fastify.register(require('@fastify/static'), {
    root: join(__dirname, 'public'),
    prefix: '/',
  });

  await fastify.register(require('@fastify/autoload'), {
    dir: join(__dirname, 'routes'),
    forceESM: true,
    routeParams: true,
  });

  await fastify.register(require('@fastify/jwt'), {
    secret: fastify.config.BEARER_TOKEN_SECRET,
    cookie: {
      cookieName: 'starfrost.session',
    },
  });

  fastify.ready(() => {
    console.log('[Starfrost] Routes\n', fastify.printRoutes());
    // console.log('[Starfrost] Routes\n', fastify.printRoutes());
    // console.log('[Starfrost] Plugins \n', fastify.printPlugins());
    // console.log('[Starfrost] Environment Variables\n', fastify.getEnvs());
    console.log('[Starfrost] Ready!');
    fastify.log.info('Ready!');
  });
};

module.exports = server;
