import { Pool } from 'pg';

class DbPool {
  private static instance: DbPool;
  private pool: Pool;

  private constructor() {
    const config = {
      host: process.env.DB_HOST as string,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER as string,
      database: process.env.DB_DATABASE as string,
      password: process.env.DB_PASS as string,
      max: 2,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    };

    this.pool = new Pool(config);

    // the pool will emit an error on behalf of any idle clients
    // it contains if a backend error or network partition happens
    this.pool.on('error', (err, client) => {
      console.error('Unexpected error on postgres idle client', err);
      process.exit(-1);
    });
  }

  static getInstance(): DbPool {
    if (!DbPool.instance) {
      DbPool.instance = new DbPool();
    }
    return DbPool.instance;
  }

  async getClient() {
    const client = await this.pool.connect();
    return client;
  }

  async end() {
    await this.pool.end();
  }
}

export const dbPool = DbPool.getInstance();