import PostgrePool from "../config/postgre.pool.js";

export default class PostgreDAO {
  private static instance: PostgreDAO | null = null;
  private postgreInstance: PostgrePool;

  private constructor(postgreInstance: PostgrePool) {
    this.postgreInstance = postgreInstance;
  }

  public static async getInstance(): Promise<PostgreDAO> {
    if (!PostgreDAO.instance) {
      const postgreInstance = await PostgrePool.getInstance();
      PostgreDAO.instance = new PostgreDAO(postgreInstance);
    }
    return Promise.resolve(PostgreDAO.instance);
  }


  public async executeQuery(query: string, values?: any[]): Promise<any> {
    try {
      //console.log('QUERY: ', query);
      //console.log('VALUES: ', values);
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
      const keysString = keys.map(key => `"${key}"`).join(', ');
      const values = Object.values(data);
      const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');

      const query = `INSERT INTO ${table} (${keysString}) VALUES (${placeholdersString}) RETURNING *`;
      const result = await this.executeQuery(query, values);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  public async getFromTable<T extends Record<string, any>>(
    table: string,
    where: Partial<T> = {},
    select?: (keyof T)[]
  ): Promise<T[]> {
    try {
      const selectFields = select && select.length > 0 ? select.map(field => `"${String(field)}"`).join(', ') : '*';
      const whereKeys = Object.keys(where);
      let whereConditions = '';
      const whereValues = Object.values(where);
      if (whereKeys.length > 0) {
        whereConditions = 'WHERE ' + whereKeys.map((key, i) => `"${String(key)}" = $${i + 1}`).join(' AND ');
      }

      const query = `SELECT ${selectFields} FROM ${table} ${whereConditions}`;
      const result = await this.executeQuery(query, whereValues);
      return result.rows;
    } catch (err) {
      throw err;
    }
  }

  public async updateTable<T extends Record<string, any>>(table: string, update: T, where: Partial<T>): Promise<number> {
    try {
      const keys = Object.keys(update);
      const keysString = keys.map(key => `"${key}"`).join(', ');
      const values = Object.values(update);
      const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');

      const whereKeys = Object.keys(where);
      const whereKeysString = whereKeys.join(', ');
      const whereValues = Object.values(where);
      const wherePlaceholdersString = whereValues.map((_, i) => '$' + (i + keys.length + 1)).join(', ');

      let query: string
      keys.length === 1 ? query = `UPDATE ${table} SET ${keysString} = ${placeholdersString}` : query = `UPDATE ${table} SET (${keysString}) = (${placeholdersString})`
      whereKeys.length === 1 ? query += ` WHERE ${whereKeysString} = ${wherePlaceholdersString}` : query += ` WHERE (${whereKeysString}) = (${wherePlaceholdersString})`

      const result = await this.executeQuery(query, [...values, ...whereValues]);
      return result.rowCount
    } catch (err) {
      throw err;
    }
  }

}

