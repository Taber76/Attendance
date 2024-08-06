var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import pg from 'pg';
import { DBASE_URL } from './environment.js';
const { Pool } = pg;
class PostgrePool {
    constructor() {
        this.pool = null;
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PostgrePool.instance) {
                PostgrePool.instance = new PostgrePool();
                yield PostgrePool.instance.connect();
            }
            return PostgrePool.instance;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
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
            }
            catch (err) {
                console.error('Unable to connect to the database:', err);
            }
        });
    }
    getPool() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.pool) {
                console.error('Connection pool has not been created.');
                return null;
            }
            try {
                return this.pool;
            }
            catch (err) {
                console.error('Unable to get connection from pool:', err);
                console.log('Attempting to reconnect to the database...');
                yield this.reconnect();
                return null;
            }
        });
    }
    reconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.close();
            yield this.connect();
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.pool) {
                try {
                    yield this.pool.end();
                    console.log('Connection pool to PostgreSQL database closed');
                }
                catch (err) {
                    console.error('Error closing the connection pool:', err);
                }
            }
        });
    }
}
export default PostgrePool;
