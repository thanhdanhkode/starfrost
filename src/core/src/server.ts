import Fastify from 'fastify';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const server = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				colorize: true,
				translateTime: 'SYS:HH:mm:ss',
				ignore: 'pid,hostname',
			},
		},
	},
});

server.register(import('@fastify/autoload'), {
	dir: join(__dirname, 'routes'),
	forceESM: true,
	routeParams: true,
});

server.register(import('@fastify/env'), {
	dotenv: true,
	schema: {},
});

server.ready(() => {
	console.log('[Starfrost] Routes \n', server.printRoutes());
	console.log('[Starfrost] Plugins \n', server.printPlugins());
});

export default server;
