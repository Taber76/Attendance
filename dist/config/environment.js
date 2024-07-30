"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.backend_url = exports.fronend_url = exports.SENDGRID_API_KEY = exports.mail_uri = exports.mail_user = exports.mail_refreshToken = exports.mail_clientSecret = exports.mail_clientId = exports.BCRYPT_ROUNDS = exports.DBASE_URL = exports.CORS_ORIGIN = exports.JWT_SECRET = exports.API_VERSION = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT;
exports.API_VERSION = process.env.API_VERSION;
exports.JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : '';
exports.CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*';
exports.DBASE_URL = process.env.DBASE_URL ? process.env.DBASE_URL : 'postgresql://postgres:postgres@localhost:5432/postgres';
exports.BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS);
exports.mail_clientId = process.env.MAIL_CLIENTID;
exports.mail_clientSecret = process.env.MAIL_CLIENTSECRET;
exports.mail_refreshToken = process.env.MAIL_REFRESHTOKEN;
exports.mail_user = process.env.MAIL_USER;
exports.mail_uri = process.env.MAIL_URI;
exports.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : '';
exports.fronend_url = process.env.FRONTEND_URL;
exports.backend_url = process.env.BACKEND_URL;
