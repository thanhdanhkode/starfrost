const { randomUUID } = require('node:crypto');

const sampleData = [
  {
    username: 'kelvin',
    email: 'kelvin@example.com',
    password: 'kelvin@starfrost',
  },
];

const Login = async (request, reply) => {
  const { username, password } = request.body;
  console.log(`Login attempt for user: ${username} with password: ${password}`);

  try {
    const user = sampleData.some((user) => user.username === username);
    console.log(user);
    if (!user) {
      return reply.status(401).send({ status: 'Failed', message: 'User not found' });
    }

    const isPasswordValid = sampleData.some((user) => user.password === password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
      return reply.status(401).send({ status: 'Failed', message: 'Invalid password' });
    }

    const token = await reply.jwtSign({ username });
    return reply.setCookie('starfrost.session', token, { path: '/' }).status(200).send();
  } catch (error) {
    return reply.status(500).send({ status: 'Error', message: 'Internal Server Error' });
  }
};

const Logout = async (request, reply) => {
  try {
    reply.clearCookie('starfrost.session', { path: '/' });
    return reply.status(200).send({ status: 'Success', message: 'Logged out successfully' });
  } catch (error) {
    reply.status(500).send({ status: 'Error', message: 'Internal Server Error' });
  }
};

const ForgotPwd = async (request, reply) => {
  try {
    console.log(request);
  } catch (error) {
    reply.status(500).send({ status: 'Error', message: 'Internal Server Error' });
  }
};

module.exports = { Login, Logout, ForgotPwd };
