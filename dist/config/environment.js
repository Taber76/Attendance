"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backend_url = exports.fronend_url = exports.SENDGRID_API_KEY = exports.BCRYPT_ROUNDS = exports.JWT_SECRET = exports.DBASE_URL = exports.CORS_ORIGIN = exports.API_VERSION = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.API_VERSION = process.env.API_VERSION;
exports.CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*';
exports.DBASE_URL = process.env.DBASE_URL ? process.env.DBASE_URL : 'postgresql://postgres:postgres@localhost:5432/postgres';
exports.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
exports.BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS);
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '';
exports.fronend_url = process.env.FRONTEND_URL;
exports.backend_url = process.env.BACKEND_URL;
