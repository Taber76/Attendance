"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const environment_1 = require("./environment");
class PostgreSQL {
    constructor() {
        this.pool = null;
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PostgreSQL.instance) {
                PostgreSQL.instance = new PostgreSQL();
                yield PostgreSQL.instance.connect();
            }
            return PostgreSQL.instance;
        });
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.pool = new pg_1.Pool({
                    connectionString: environment_1.DBASE_URL,
                    min: 1,
                    max: 10,
                    idleTimeoutMillis: 60000
                });
                yield this.pool.connect();
                console.log('Connected to PostgreSQL database');
            }
            catch (err) {
                console.error('Unable to connect to the database:', err);
            }
        });
    }
    getConnection() {
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
exports.default = PostgreSQL;
