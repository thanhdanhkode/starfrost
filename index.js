(async () => {
  const fastify = require('fastify')({
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
    await fastify.register(require('./server.js'));
    await fastify.listen({ port: 80 });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
