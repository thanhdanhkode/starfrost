const { randomUUID } = require('node:crypto');

class UserManager {
  constructor(fastify) {
    this.fastify = fastify;
    this.init();
  }

  init() {
    this.fastify.log.info('User Manager Ready!');
  }

  create({ username, password, userEmail, userRole }) {
    const userId = randomUUID();
    const session = this.fastify.jwt.sign({ username });
    return new Promise((resolve, reject) => {
      const sql = `
			INSERT INTO users (userId, userName, userEmail, password, role, session)
			VALUES (?, ?, ?, ?, ?, ?)
			`;
      this.fastify.database.run(sql, [userId, username, userEmail, password, userRole, session], (error) => {
        if (error) {
          this.fastify.log.error(error);
          return reject(error);
        } else {
          this.fastify.log.info(`Creating user with name: ${username}`);
          resolve({
            userId,
            username,
            password,
            userRole,
            session,
          });
        }
      });
    });
  }

  getAll() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from users`;
      const allUsers = [];
      this.fastify.database.all(sql, [], (error, rows) => {
        if (error) {
          this.fastify.log.error(error);
          return reject(error);
        }
        rows.forEach((row) => {
          allUsers.push({
            userId: row.userId,
            userName: row.userName,
            role: row.role,
          });
        });
        resolve(allUsers);
      });
    });
  }

  getById({ userId }) {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * from users WHERE userId = ?`;
      const allUsers = [];
      this.fastify.database.all(sql, [userId], (error) => {
        if (error) {
          this.fastify.log.error(error);
          return reject(error);
        }
        rows.forEach((row) => {
          allUsers.push({
            userId: row.userId,
            userName: row.userName,
            role: row.role,
          });
        });
        resolve(allUsers);
      });
    });
  }
}

module.exports = UserManager;
