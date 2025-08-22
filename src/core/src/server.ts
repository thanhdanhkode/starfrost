import Fastify from 'fastify';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

declare module 'fastify' {
	interface FastifyInstance {
		config: {
			BEARER_TOKEN_SECRET: string;
		};
	}
}

const server = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:HH:mm:ss',
				ignore: 'pid,hostname,req,reqId,res,responseTime,',
			},
		},
	},
});

server.register(import('@fastify/websocket'));

server.register(import('@fastify/autoload'), {
	dir: join(__dirname, 'routes'),
	forceESM: true,
	routeParams: true,
});

await server.register(import('@fastify/env'), {
	dotenv: true,
	schema: {
		type: 'object',
		properties: {
			BEARER_TOKEN_SECRET: { type: 'string' },
		},
	},
});

server.register(import('@fastify/bearer-auth'), {
	keys: new Set([server.config.BEARER_TOKEN_SECRET]),
	contentType: undefined,
	bearerType: 'Bearer',
	errorResponse: (err) => {
		console.error(err);
		return { error: err.message };
	},
});

server.ready(() => {
	console.log('[Starfrost] Routes \n', server.printRoutes());
	// console.log('[Starfrost] Plugins \n', server.printPlugins());
	console.log('[Starfrost] Environment Variables \n', server.getEnvs());
});

export default server;
