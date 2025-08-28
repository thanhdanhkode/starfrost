const { join } = require('node:path');
const fs = require('node:fs');
const CleanCSS = require('clean-css');
const { minify } = require('terser');
const DefaultRoute = (fastify, option) => {
  fastify.get('/', async (request, reply) => {
    return reply.status(200).send({ message: 'Starfrost is opened' });
  fastify.get('/:fileName(^\\w+).css', (request, reply) => {
    const { fileName } = request.params;
    const filePath = join(__dirname, '..', 'views', 'styles', `${fileName}.css`);
    if (!fs.existsSync(filePath)) return reply.status(404).send({ error: 'File not found' });
    const minifiedCSS = new CleanCSS({ inline: '!fonts.googleapis.com' }).minify([filePath]);
    return reply.type('text/css').send(minifiedCSS.styles);
  });

  fastify.get('/:fileName(^\\w+).js', async (request, reply) => {
    const { fileName } = request.params;
    const filePath = join(__dirname, '..', 'views', 'js', `${fileName}.mjs`);
    if (!fs.existsSync(filePath)) return reply.status(404).send({ error: 'File not found' });
    const minifiedJS = await minify(fs.readFileSync(filePath, 'utf8'));
    return reply.type('application/javascript').send(minifiedJS.code);
  });
  });
};

module.exports = DefaultRoute;
