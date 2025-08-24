import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = async (fastify, options) => {
	await fastify.register(import('@fastify/websocket'));

	await fastify.register(import('@fastify/autoload'), {
		dir: join(__dirname, 'routes'),
		forceESM: true,
		routeParams: true,
	});

	await fastify.register(import('@fastify/env'), {
		dotenv: true,
		schema: {
			type: 'object',
			properties: {
				BEARER_TOKEN_SECRET: { type: 'string' },
			},
		},
	});

	await fastify.register(import('@fastify/bearer-auth'), {
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

export default server;
