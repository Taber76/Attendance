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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const postgre_pool_1 = __importDefault(require("../config/postgre.pool"));
class PostgreDAO {
    constructor(postgreInstance) {
        this.postgreInstance = postgreInstance;
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PostgreDAO.instance) {
                const postgreInstance = yield postgre_pool_1.default.getInstance();
                PostgreDAO.instance = new PostgreDAO(postgreInstance);
            }
            return Promise.resolve(PostgreDAO.instance);
        });
    }
    executeQuery(query, values) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //console.log('QUERY: ', query);
                //console.log('VALUES: ', values);
                const pool = yield this.postgreInstance.getPool();
                if (!pool)
                    throw new Error('Database connection error');
                const client = yield pool.connect();
                try {
                    const result = yield client.query(query, values);
                    return result;
                }
                finally {
                    client.release();
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    insertIntoTable(table, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = Object.keys(data);
                const keysString = keys.map(key => `"${key}"`).join(', ');
                const values = Object.values(data);
                const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');
                const query = `INSERT INTO ${table} (${keysString}) VALUES (${placeholdersString}) RETURNING *`;
                const result = yield this.executeQuery(query, values);
                return result.rows;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getFromTable(table_1) {
        return __awaiter(this, arguments, void 0, function* (table, where = {}, select) {
            try {
                const selectFields = select && select.length > 0 ? select.map(field => `"${String(field)}"`).join(', ') : '*';
                const whereKeys = Object.keys(where);
                let whereConditions = '';
                const whereValues = Object.values(where);
                if (whereKeys.length > 0) {
                    whereConditions = 'WHERE ' + whereKeys.map((key, i) => `"${String(key)}" = $${i + 1}`).join(' AND ');
                }
                const query = `SELECT ${selectFields} FROM ${table} ${whereConditions}`;
                const result = yield this.executeQuery(query, whereValues);
                return result.rows;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateTable(table, update, where) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const keys = Object.keys(update);
                const keysString = keys.map(key => `"${key}"`).join(', ');
                const values = Object.values(update);
                const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');
                const whereKeys = Object.keys(where);
                const whereKeysString = whereKeys.join(', ');
                const whereValues = Object.values(where);
                const wherePlaceholdersString = whereValues.map((_, i) => '$' + (i + keys.length + 1)).join(', ');
                const query = `UPDATE ${table} SET (${keysString}) = (${placeholdersString}) WHERE (${whereKeysString}) = (${wherePlaceholdersString})`;
                const result = yield this.executeQuery(query, [...values, ...whereValues]);
                return result.rowCount;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
PostgreDAO.instance = null;
exports.default = PostgreDAO;
