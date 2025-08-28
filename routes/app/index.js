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
      return reply.viewAsync(
        './pages/InstanceByIdOverview.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: request.params.instanceId, name: 'Instance Name' },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get(
    '/instances/:instanceId/overview',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      return reply.viewAsync(
        './pages/InstanceByIdOverview.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: request.params.instanceId, name: 'Instance Name' },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );
  fastify.get(
    '/instances/:instanceId/terminal',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      return reply.viewAsync(
        './pages/InstanceByIdTerminal.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: request.params.instanceId, name: 'Instance Name' },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );
  fastify.get(
    '/instances/:instanceId/files',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      return reply.viewAsync(
        './pages/InstanceByIdFiles.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: request.params.instanceId, name: 'Instance Name' },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get(
    '/instances/:instanceId/settings',
    { preHandler: fastify.auth([fastify.verifyAppJWT]) },
    async (request, reply) => {
      return reply.viewAsync(
        './pages/InstanceByIdSettings.ejs',
        {
          title: 'Instance Detail • Starfrost',
          instanceData: { id: request.params.instanceId, name: 'Instance Name' },
        },
        { layout: './partials/layouts/InstanceLayout.ejs' },
      );
    },
  );

  fastify.get('/users', { preHandler: fastify.auth([fastify.verifyAppJWT]) }, async (request, reply) => {
    return reply.viewAsync(
      './pages/User.ejs',
      {
        title: 'Users • Starfrost',
        userData: [
          {
            id: 1,
            name: 'User 1',
            role: 'admin',
          },
          {
            id: 2,
            name: 'User 2',
            role: 'normal',
          },
          {
            id: 3,
            name: 'User 3',
            role: 'normal',
          },
          {
            id: 4,
            name: 'User 4',
            role: 'normal',
          },
          {
            id: 5,
            name: 'User 5',
            role: 'normal',
          },
        ],
      },
      { layout: './partials/layouts/AppLayout.ejs' },
    );
  });
};

module.exports = AppRoute;
