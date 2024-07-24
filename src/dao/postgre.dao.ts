import PostgreSQL from "../config/postgre.client";

export default class PostgreDAO {
  private static instance: PostgreDAO | null = null;
  private postgreInstance: PostgreSQL;

  private constructor(postgreInstance: PostgreSQL) {
    this.postgreInstance = postgreInstance;
  }

  public static async getInstance(): Promise<PostgreDAO> {
    if (!PostgreDAO.instance) {
      const postgreInstance = await PostgreSQL.getInstance();
      PostgreDAO.instance = new PostgreDAO(postgreInstance);
    }
    return Promise.resolve(PostgreDAO.instance);
  }


  private async executeQuery(query: string, values?: any[]): Promise<any> {
    try {
      const pool = await this.postgreInstance.getPool();
      if (!pool) throw new Error('Database connection error');
      const client = await pool.connect();
      try {
        const result = await client.query(query, values);
        return result;
      } finally {
        client.release();
      }
    } catch (err) {
      throw err;
    }
  }


  public async insertIntoTable<T extends Record<string, any>>(table: string, data: T): Promise<any> {
    try {
      const keys = Object.keys(data);
      const keysString = keys.join(', ');
      const values = Object.values(data);
      const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');

      const query = `INSERT INTO ${table} (${keysString}) VALUES (${placeholdersString}) RETURNING *`;
      const result = await this.executeQuery(query, values);
      return result
    } catch (err) {
      throw err;
    }
  }

  public async getFromTable<T extends Record<string, any>>(
    table: string,
    where: Partial<T>,
    select?: (keyof T)[]
  ): Promise<T[]> {
    try {
      const selectFields = select && select.length > 0 ? select.join(', ') : '*';

      const whereKeys = Object.keys(where);
      const whereConditions = whereKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
      const whereValues = Object.values(where);

      const query = `SELECT ${selectFields} FROM ${table} WHERE ${whereConditions}`;
      const result = await this.executeQuery(query, whereValues);
      return result;
    } catch (err) {
      throw err;
    }
  }


  public async updateTable<T extends Record<string, any>>(table: string, data: T, where: T): Promise<void> {
    try {
      const keys = Object.keys(data);
      const keysString = keys.join(', ');
      const values = Object.values(data);
      const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');

      const whereKeys = Object.keys(where);
      const whereKeysString = whereKeys.join(', ');
      const whereValues = Object.values(where);
      const wherePlaceholdersString = whereValues.map((_, i) => '$' + (i + 1)).join(', ');

      const query = `UPDATE ${table} SET (${keysString}) = (${placeholdersString}) WHERE (${whereKeysString}) = (${wherePlaceholdersString})`;
      const result = await this.executeQuery(query, [...values, ...whereValues]);
      return result
    } catch (err) {
      throw err;
    }
  }

}

