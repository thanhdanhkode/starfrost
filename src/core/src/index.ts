import Fastify from 'fastify';

(async () => {
	const fastify = Fastify({
		logger: {
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					translateTime: 'SYS:HH:mm:ss',
					ignore: 'pid,hostname,req,reqId,res,responseTime',
				},
			},
		},
	});

	try {
		await fastify.register(import('./server.js'));
		await fastify.listen({ port: 3000 });
	} catch (error) {
		fastify.log.error(error);
		process.exit(1);
	}
})();
