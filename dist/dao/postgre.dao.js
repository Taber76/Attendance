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
                const keysString = keys.join(', ');
                const values = Object.values(data);
                const placeholdersString = values.map((_, i) => '$' + (i + 1)).join(', ');
                const query = `INSERT INTO ${table} (${keysString}) VALUES (${placeholdersString}) RETURNING *`;
                const result = yield this.executeQuery(query, values);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
    getFromTable(table, where, select) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectFields = select && select.length > 0 ? select.join(', ') : '*';
                const whereKeys = Object.keys(where);
                const whereConditions = whereKeys.map((key, i) => `${key} = $${i + 1}`).join(' AND ');
                const whereValues = Object.values(where);
                const query = `SELECT ${selectFields} FROM ${table} WHERE ${whereConditions}`;
                const result = yield this.executeQuery(query, whereValues);
                return result.rows;
            }
            catch (err) {
                throw err;
            }
        });
    }
    updateTable(table, data, where) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield this.executeQuery(query, [...values, ...whereValues]);
                return result;
            }
            catch (err) {
                throw err;
            }
        });
    }
}
PostgreDAO.instance = null;
exports.default = PostgreDAO;
