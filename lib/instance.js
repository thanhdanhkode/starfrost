const { execa } = require('execa');
const fs = require('fs');
const { randomUUID } = require('node:crypto');
const { join, resolve } = require('node:path');

class InstanceManager {
  constructor(fastify) {
    this.instances = [];
    this.fastify = fastify;
  }

  async init() {
    this.checkDirectory();
    await this.load();
    this.fastify.log.info('Instance Manager initialized');
  }

  checkDirectory() {
    try {
      const instanceDir = join(this.fastify.config.APP_DIRECTORY, 'instances');
      if (!fs.existsSync(instanceDir)) fs.mkdirSync(instanceDir);
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  load() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM instances`;
      this.fastify.database.db.all(sql, [], (error, rows) => {
        if (error) {
          this.fastify.log.error(error);
          reject(error);
          return;
        }
        this.instances = [];
        rows.forEach((row) => {
          this.instances.push({
            instance: null,
            instanceId: row.instanceId,
            instanceName: row.instanceName,
            instanceOwner: row.instanceOwner,
            instancePath: row.instancePath,
            instanceStatus: 'stopped',
          });
        });
        this.fastify.log.info(`Loaded ${this.instances.length} instances`);
        resolve(this.instances);
      });
    });
  }

  info({ instanceId }) {
    if (instanceId === 'all') return this.instances;
    else return this.instances.find((instance) => instance.instanceId === instanceId);
  }

  create({ instanceName, instanceOwner, instanceConfig, reply }) {
    const instanceId = randomUUID();
    const instancePath = join(this.fastify.config.APP_DIRECTORY, 'instances', `${instanceId}`);
    return new Promise((resolve, reject) => {
      const sql = `
				INSERT INTO instances (instanceId, instanceName, instanceOwner, instancePath)
				VALUES (?, ?, ?, ?)
			`;
      this.fastify.database.db.run(sql, [instanceId, instanceName, instanceOwner, instancePath], (error) => {
        if (error) {
          this.fastify.log.error(error);
          reject(error);
        } else {
					if (!fs.existsSync(instancePath)) fs.mkdirSync(instancePath);
					if (!this.instances.find((instance) => instance.instanceId === instanceId)) this.instances.push({
            instance: null,
            instanceId: instanceId,
            instanceName: instanceName,
            instanceOwner: instanceOwner,
            instancePath: instancePath,
            instanceStatus: 'stopped',
          });
          this.fastify.log.info(`Creating instance with name: ${instanceName}`);
          resolve({ instanceId, instanceName, instanceOwner, instanceConfig });
        }
      });
    });
  }

  delete({ instanceId }) {
    const instancePath = join(__dirname, '..', '.starfrost', 'instances', `${instanceId}`);
    return new Promise((resolve, reject) => {
      const sql = `
			DELETE FROM instances WHERE instanceId = ?;
			`;
      this.fastify.database.db.run(sql, [instanceId], (error) => {
        if (error) {
          this.fastify.log.error(error);
          reject(error);
        } else {
          this.fastify && this.fastify.log.info(`Delete instance with id: ${instanceId}`);
          if (fs.existsSync(instancePath)) fs.rmSync(instancePath, { recursive: true, force: true });
          resolve();
        }
      });
    });
  }

  start({ instanceId }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex < 0) throw new Error('No Instance Found');
      this.instances[instanceIndex].instance = execa(
        'D:\\Minecraft\\Proxies\\jre21\\bin\\java.exe',
        [`-Xmx1024M`, `-Xms1024M`, '-jar', `${join(this.instances[instanceIndex].instancePath, 'velocity.jar')}`],
        {
          cwd: this.instances[instanceIndex].instancePath,
          stdin: 'pipe',
          stdout: 'pipe',
          stderr: 'pipe',
        },
      );
      this.instances[instanceIndex].instance.stdout.on('data', (data) => {
        if (data.toString().includes('Done')) this.instances[instanceIndex].instanceStatus = 'running';
        console.log(`[${instanceIndex}]`, data.toString());
      });
      this.instances[instanceIndex].instance.stderr.on('data', (data) => {
        this.fastify.log.error(`[${instanceIndex}] [ERROR]`, data.toString());
      });
      this.instances[instanceIndex].instance.on('exit', (code) => {
        this.fastify.log.info(`Instance '${this.instances[instanceIndex].instanceName}' exited with code ${code}`);
        this.instances[instanceIndex].instance = null;
        this.instances[instanceIndex].instanceStatus = 'stopped';
      });
      this.instances[instanceIndex].instance.catch((error) => {
        if (error.signal === 'SIGTERM') {
          this.fastify.log.info(`Instance ${this.instances[instanceIndex].instanceName} was terminated (SIGTERM)`);
        } else {
          this.fastify.log.error(`Instance ${this.instances[instanceIndex].instanceName} error: `, error);
        }
      });

      this.instances[instanceIndex].instanceStatus = 'starting';
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  stop({ instanceId }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else {
        if (!this.instances[instanceIndex].instance) throw new Error('Instance is not running');
        this.instances[instanceIndex].instance.stdin.end('shutdown');
      }
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  kill({ instanceId }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else {
        if (!this.instances[instanceIndex].instance) throw new Error('Instance is not running');
        this.instances[instanceIndex].instance.kill('SIGTERM');
      }
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  sendCommand({ instanceId, command }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else this.instances[instanceIndex].instance.stdin.end(command);
    } catch (error) {
      this.fastify.log.error('Error sending command:', error);
    }
  }
}

module.exports = InstanceManager;
