const { randomUUID } = require('node:crypto');
const { request } = require('node:http');

const createInstance = async (request, reply) => {
  const { instanceName, instanceOwner, type, environment, limits } = request.body;
  const data = await reply.server.instance.create({
    instanceName,
    instanceOwner,
    instanceConfig: { type, environment, limits },
    reply,
  });

  return reply.status(200).send(data);
};

const getAllInstances = async (request, reply) => {};

const getInstanceById = async (request, reply) => {
  const { instanceId } = request.params;

  const data = reply.server.instance.info({ instanceId });

  return reply.status(200).send(data);
};

const updateInstance = async (request, reply) => {};

const deleteInstance = async (request, reply) => {
  const { instanceId } = request.params;

  await reply.server.instance.delete({ instanceId });
};

const powerInstance = async (request, reply) => {
  const { instanceId } = request.params;
  const { action } = request.body;

  if (action === 'start') {
    reply.server.instance.start({ instanceId });
    // if (instance) return reply.status(400).send({ error: 'Instance already running' });
  } else if (action === 'stop') {
    reply.server.instance.stop({ instanceId });
    // if (!instance) return reply.status(400).send({ error: 'Instance not running' });
  } else if (action === 'restart') {
    reply.server.instance.stop({ instanceId });
    // if (!instance) return reply.status(400).send({ error: 'Instance not running' });
  } else if (action === 'kill') {
    reply.server.instance.kill({ instanceId });
    // if (!instance) return reply.status(400).send({ error: 'Instance not running' });
  } else {
    reply.status(400).send({ error: 'Unknown action' });
  }
  return reply.status(204).send();
};

const commandInstance = async (request, reply) => {
  const { instanceId } = request.params;
  const { command } = request.body;

  if (!command || typeof command !== 'string') return reply.status(400).send({ error: 'Invalid command' });

  reply.server.instance.sendCommand({ instanceId, command });
  return reply.status(204).send();
};

module.exports = {
  createInstance,
  getAllInstances,
  getInstanceById,
  updateInstance,
  deleteInstance,
  powerInstance,
  commandInstance,
};
