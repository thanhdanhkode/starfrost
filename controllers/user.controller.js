const { randomBytes, randomUUID } = require('node:crypto');

const createUser = async (request, reply) => {
  const { username, email } = request.body;
  return reply
    .status(201)
    .send({ userId: 3, username, email, uuid: randomUUID(), password: randomBytes(16).toString('hex') });
};

const getAllUsers = async (request, reply) => {
  return reply.status(200).send([
    {
      userId: 1,
      username: 'john_doe',
      email: 'john@example.com',
      uuid: randomUUID(),
      randomBytes: randomBytes(16).toString('hex'),
    },
    {
      userId: 2,
      username: 'jane_doe',
      email: 'jane@example.com',
      uuid: randomUUID(),
      password: randomBytes(16).toString('hex'),
    },
  ]);
};

const getUserById = async (request, reply) => {
  return reply.status(200).send({
    userId: 1,
    username: 'john_doe',
    email: 'john@example.com',
    uuid: randomUUID(),
    randomBytes: randomBytes(16).toString('hex'),
  });
};

const updateUser = () => {};

const deleteUser = () => {};

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
