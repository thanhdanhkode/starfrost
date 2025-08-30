const verifyAppJWT = (request, reply, done) => {
  const cookie = request.cookies;

  const token = cookie && cookie['starfrost.session'];

  if (!token) return reply.redirect('/login');

  request.jwtVerify({ onlyCookie: true });

  done();
};

const AppRoute = (fastify, options) => {
  fastify.decorate('verifyAppJWT', verifyAppJWT);

  fastify.get('/', { preHandler: fastify.verifyAppJWT }, async (request, reply) => {
    return reply.viewAsync('./pages/Home.ejs', { title: 'Starfrost' }, { layout: './partials/layouts/AppLayout.ejs' });
  });

  fastify.get('/instances', { preHandler: fastify.auth([fastify.verifyAppJWT]) }, async (request, reply) => {
    const data = reply.server.instance.info({ instanceId: 'all' });
    return reply.viewAsync(
      './pages/Instance.ejs',
      {
        title: 'Instances • Starfrost',
        instanceData: data,
      },
      { layout: './partials/layouts/AppLayout.ejs' },
    );
  });

  fastify.get(
    '/instances/:instanceId',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      const { instanceId } = request.params;
      const data = reply.server.instance.info({ instanceId });

      return reply.viewAsync(
        './pages/InstanceByIdOverview.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: data.InstanceId, name: data.instanceName, status: data.instanceStatus },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get(
    '/instances/:instanceId/overview',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      const { instanceId } = request.params;
      const data = reply.server.instance.info({ instanceId });

      return reply.viewAsync(
        './pages/InstanceByIdOverview.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: data.InstanceId, name: data.instanceName, status: data.instanceStatus },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );
  fastify.get(
    '/instances/:instanceId/terminal',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      const { instanceId } = request.params;
      const data = reply.server.instance.info({ instanceId });

      return reply.viewAsync(
        './pages/InstanceByIdTerminal.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: data.InstanceId, name: data.instanceName, status: data.instanceStatus },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );
  fastify.get(
    '/instances/:instanceId/files',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      const { instanceId } = request.params;
      const data = reply.server.instance.info({ instanceId });

      return reply.viewAsync(
        './pages/InstanceByIdFiles.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: data.InstanceId, name: data.instanceName, status: data.instanceStatus },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get(
    '/instances/:instanceId/settings',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      const { instanceId } = request.params;
      const data = reply.server.instance.info({ instanceId });

      return reply.viewAsync(
        './pages/InstanceByIdSettings.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: data.InstanceId, name: data.instanceName, status: data.instanceStatus },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get('/users', { preHandler: fastify.auth([fastify.verifyAppJWT]) }, async (request, reply) => {
    const data = await reply.server.user.getAll();
    console.log(data);

    return reply.viewAsync(
      './pages/User.ejs',
      {
        title: 'Users • Starfrost',
        userData: data,
      },
      { layout: './partials/layouts/AppLayout.ejs' },
    );
  });

  fastify.get('/users/:userId', { preHandler: fastify.auth([fastify.verifyAppJWT]) }, async (request, reply) => {
    const data = await reply.server.user.getAll();
    console.log(data);

    return reply.viewAsync(
      './pages/UserById.ejs',
      {
        title: 'Users • Starfrost',
        userData: data,
      },
      { layout: './partials/layouts/AppLayout.ejs' },
    );
  });
};

module.exports = AppRoute;
