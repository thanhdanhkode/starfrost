const { execa } = require('execa');
const fs = require('fs');
const { randomUUID, randomInt } = require('node:crypto');
const { join, resolve } = require('node:path');
const pidusage = require('pidusage');

class InstanceManager {
  constructor(fastify) {
    this.instances = [];
    this.instanceUsage = pidusage;
    this.fastify = fastify;
    this.init();
  }

  async init() {
    this.checkDirectory();
    await this.load();
    this.fastify.log.info('Instance Manager Ready!');
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
      this.fastify.database.all(sql, [], (error, rows) => {
        if (error) {
          this.fastify.log.error(error);
          return reject(error);
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
            instanceLogs: [],
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
      this.fastify.database.run(sql, [instanceId, instanceName, instanceOwner, instancePath], (error) => {
        if (error) {
          this.fastify.log.error(error);
          reject(error);
        } else {
          if (!fs.existsSync(instancePath)) fs.mkdirSync(instancePath);
          if (!this.instances.find((instance) => instance.instanceId === instanceId))
            this.instances.push({
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
    const instancePath = join(this.fastify.config.APP_DIRECTORY, 'instances', `${instanceId}`);
    return new Promise((resolve, reject) => {
      const sql = `
			DELETE FROM instances WHERE instanceId = ?;
			`;
      this.fastify.database.run(sql, [instanceId], (error) => {
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
        [`-Xmx2048M`, `-Xms1024M`, '-jar', `${join(this.instances[instanceIndex].instancePath, 'server.jar')}`],
        {
          cwd: this.instances[instanceIndex].instancePath,
          stdin: 'pipe',
          stdout: 'pipe',
          stderr: 'pipe',
        },
      );
      this.instances[instanceIndex].instance.stdout.on('data', (data) => {
        if (data.toString().includes('Done')) this.instances[instanceIndex].instanceStatus = 'running';
        if (this.instances[instanceIndex].instanceLogs.length === 1000) {
          this.instances[instanceIndex].instanceLogs.shift();
        }
        console.log(this.instances[instanceIndex].instanceLogs.length);
        this.instances[instanceIndex].instanceLogs.push({ logId: randomInt(6), logMessage: data.toString() });
      });
      this.instances[instanceIndex].instance.stderr.on('data', (data) => {
        this.fastify.log.error(`[${instanceIndex}] [ERROR]`, data.toString());
      });
      this.instances[instanceIndex].instance.on('exit', (code) => {
        this.instances[instanceIndex].instance = null;
        this.instances[instanceIndex].instanceStatus = 'stopped';
        this.fastify.log.info(`Instance '${this.instances[instanceIndex].instanceName}' exited with code ${code}`);
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
        // this.instances[instanceIndex].instance.stdin.end('shutdown');
        this.instances[instanceIndex].instance.kill('SIGTERM');
      }
    } catch (error) {
      this.fastify.log.error(error);
    }
  }

  restart({ instanceId }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else {
        if (!this.instances[instanceIndex].instance) throw new Error('Instance is not running');
        else {
          this.instances[instanceIndex].instance.kill('SIGTERM');
          this.start({ instanceId });
        }
      }
    } catch (error) {
      this.fastify.log.error('Error sending command:', error);
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

  async resource({ instanceId }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else return await this.instanceUsage(this.instances[instanceIndex].instance.pid);
    } catch (error) {
      this.fastify.log.error('Error sending command:', error);
    }
  }

  stream({ instanceId, type }) {
    try {
      const instanceIndex = this.instances.findIndex((instance) => instance.instanceId === instanceId);
      if (instanceIndex === -1) throw new Error('No Instance Found');
      else {
        switch (type) {
          case 'console log':
            return JSON.stringify(this.instances[instanceIndex].instanceLogs);
          default:
            return null;
        }
      }
    } catch (error) {
      if (error.message === 'No Instance is running') this.fastify.log.error(`Instance '${instanceId}' is not running`);
      else this.fastify.log.error(error);
    }
  }
}

module.exports = InstanceManager;
