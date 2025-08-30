const { join } = require('node:path');
const fs = require('node:fs');
const CleanCSS = require('clean-css');
const { minify } = require('terser');

const allowAnonymous = (request, reply, done) => {
  if (request.header.authorization) {
    return done(Error('Not Anonymous'));
  }
  done();
};

const DefaultRoute = (fastify, option) => {
  fastify.decorate('allowAnonymous', allowAnonymous);

  fastify.addHook('onRequest', (request, reply, done) => {
    const cookie = request.cookies;
    const requiredCookies = ['starfrost.config', 'starfrost.lang', 'starfrost.session'];
    let cookieSet = requiredCookies;
    for (const key in cookie) {
      if (requiredCookies.includes(key)) cookieSet = cookieSet.filter((item) => item !== key);
    }
    cookieSet.map((cookie) => {
      reply.cookie(cookie, '');
    });
    done();
  });

  fastify.get('/', async (request, reply) => {
    const cookie = request.cookies;
    const session = cookie['starfrost.session'];
    if (!session) return reply.redirect('/login');
    if (
      session ===
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtlbHZpbiIsImlhdCI6MTc1NjI2MTI3N30.YLeGNhZr9QRY-Y4sNuFmGq28d6WbVu_JPTj6NUZYBpk'
    )
      return reply.redirect('/app');
    else return reply.viewAsync('index.ejs', { title: 'Starfrost' });
  });

  fastify.get('/:fileName(^[\\w-.]+).css', (request, reply) => {
    const { fileName } = request.params;
    const filePath = join(__dirname, '..', 'views', 'styles', `${fileName}.css`);
    if (!fs.existsSync(filePath)) return reply.status(404).send({ error: 'File not found' });
    if (fileName.endsWith('.min')) return reply.sendFile(`${fileName}.css`, join(__dirname, '..', 'views', 'styles'));
    const minifiedCSS = new CleanCSS({ inline: '!fonts.googleapis.com' }).minify([filePath]);
    return reply.type('text/css').send(minifiedCSS.styles);
  });

  fastify.get('/:fileName(^[\\w-.]+).js', async (request, reply) => {
    const { fileName } = request.params;
    const filePath = join(__dirname, '..', 'views', 'js', `${fileName}.mjs`);
    if (!fs.existsSync(filePath)) return reply.status(404).send({ error: 'File not found' });
    const minifiedJS = await minify(fs.readFileSync(filePath, 'utf8'));
    return reply.type('application/javascript').send(minifiedJS.code);
  });

  fastify.get('/login', {}, async (request, reply) => {
    const cookie = request.cookies;
    const session = cookie['starfrost.session'];
    if (!session) return reply.viewAsync('./pages/Login.ejs', { title: 'Login' });
    if (
      session ===
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImtlbHZpbiIsImlhdCI6MTc1NjI2MTI3N30.YLeGNhZr9QRY-Y4sNuFmGq28d6WbVu_JPTj6NUZYBpk'
    )
      return reply.redirect('/app');
    return reply.viewAsync('./pages/Login.ejs', { title: 'Login' });
  });
};

module.exports = DefaultRoute;
