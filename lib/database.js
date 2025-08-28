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
    const databasePath = join(__dirname, '..', '.starfrost', 'database.db');
    if (!fs.existsSync(databasePath)) {
      fs.mkdirSync(join(__dirname, '..', '.starfrost'), { recursive: true });
      fs.writeFileSync(databasePath, '');
    }
  }

  init() {
    this.checkDatabaseExist();
    this.db = new sqlite3.Database('./.starfrost/database.db', sqlite3.OPEN_READWRITE, (error) => {
      if (error) return this.fastify.log.error('Could not connect to database', error);
    });
    this.db.run(
      `CREATE TABLE IF NOT EXISTS instances(
			instanceId TEXT PRIMARY KEY,
			instanceName TEXT NOT NULL,
			instanceOwner TEXT NOT NULL,
			instancePath TEXT NOT NULL,
			createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
			updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
      [],
      (error) => {
        if (error) return this.fastify.log.error('Error in creating table', error);
      },
    );
    this.db.run(
      `CREATE TABLE IF NOT EXISTS users(
			userId INTEGER PRIMARY KEY,
			userName TEXT NOT NULL,
			userEmail TEXT NOT NULL,
			password TEXT NOT NULL,
			role TEXT NOT NULL,
			session TEXT NOT NULL,
			createAt DATETIME DEFAULT CURRENT_TIMESTAMP,
			updateAt DATETIME DEFAULT CURRENT_TIMESTAMP
		)`,
      [],
      (error) => {
        if (error) return this.fastify.log.error('Error in creating table');
      },
    );
    this.fastify.log.info('Database Manager initialized');
  }
}

module.exports = DatabaseManager;
