const { join } = require('node:path');
const fs = require('node:fs');
const sqlite3 = require('sqlite3').verbose();

class DatabaseManager {
  constructor(fastify) {
    this.db = null;
    this.fastify = fastify;
    this.init();
  }

  checkDatabaseExist() {
    const databasePath = join(this.fastify.config.APP_DIRECTORY, 'database.db');
    if (!fs.existsSync(databasePath)) {
      fs.mkdirSync(join(this.fastify.config.APP_DIRECTORY), { recursive: true });
      fs.writeFileSync(databasePath, '');
    }
  }

  init() {
    this.checkDatabaseExist();
    this.db = new sqlite3.Database(
      join(this.fastify.config.APP_DIRECTORY, 'database.db'),
      sqlite3.OPEN_READWRITE,
      (error) => error && this.fastify.log.error('Could not connect to database', error),
    );
    this.run(
      `CREATE TABLE IF NOT EXISTS instances(
			instanceId TEXT PRIMARY KEY,
			instanceName TEXT NOT NULL,
			instanceOwner TEXT NOT NULL,
			instancePath TEXT NOT NULL,
			createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
			updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
    );
    this.run(
      `CREATE TABLE IF NOT EXISTS users(
			userId TEXT PRIMARY KEY,
			userName TEXT NOT NULL,
			userEmail TEXT NOT NULL,
			password TEXT NOT NULL,
			role TEXT NOT NULL,
			session TEXT NOT NULL,
			createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
			updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
    );
    this.run(`
			CREATE TABLE IF NOT EXISTS tokens(
			tokenId TEXT PRIMARY KEY,
			tokenName TEXT NOT NULL,
			tokenOwner TEXT NOT NULL,
			tokenPermission TEXT NOT NULL,
			createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
			updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
			)
		`);
    this.fastify.log.info('Database Manager Ready!');
  }

  run(sql, params = [], callback = (error) => error && this.fastify.log.error(error)) {
    this.db.run(sql, params, callback);
  }

  all(sql, params = [], callback = (error) => error && this.fastify.log.error(error)) {
    this.db.all(sql, params, callback);
  }
}

module.exports = DatabaseManager;
