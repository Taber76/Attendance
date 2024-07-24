import pg from 'pg';
import { DBASE_URL } from './environment';

const { Pool } = pg;

class PostgrePool {
  private static instance: PostgrePool;
  private pool: any | null = null;

  private constructor() { }

  public static async getInstance(): Promise<PostgrePool> {
    if (!PostgrePool.instance) {
      PostgrePool.instance = new PostgrePool();
      await PostgrePool.instance.connect();
    }
    return PostgrePool.instance;
  }

  private async connect(): Promise<void> {
    try {
      this.pool = new Pool({
        connectionString: DBASE_URL,
        ssl: { rejectUnauthorized: false },
        min: 1,
        max: 10,
        idleTimeoutMillis: 60000
      });
      //await this.pool.connect();
      console.log('Connected to PostgreSQL database');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
    }
  }

  public async getPool(): Promise<pg.Pool | null> {
    if (!this.pool) {
      console.error('Connection pool has not been created.');
      return null;
    }
    try {
      return this.pool;
    } catch (err) {
      console.error('Unable to get connection from pool:', err);
      console.log('Attempting to reconnect to the database...');
      await this.reconnect();
      return null;
    }
  }


  private async reconnect(): Promise<void> {
    await this.close();
    await this.connect();
  }

  public async close(): Promise<void> {
    if (this.pool) {
      try {
        await this.pool.end();
        console.log('Connection pool to PostgreSQL database closed');
      } catch (err) {
        console.error('Error closing the connection pool:', err);
      }
    }
  }
}

export default PostgrePool;
