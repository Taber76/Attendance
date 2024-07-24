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
exports.generateToken = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_client_js_1 = require("../config/prisma.client.js");
const environment_js_1 = require("../config/environment.js");
passport_1.default.use('userJWT', new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: environment_js_1.JWT_SECRET,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!payload.id) {
            return done(null, false);
        }
        return done(null, payload);
    }
    catch (error) {
        return done(error);
    }
})));
passport_1.default.use('adminJWT', new passport_jwt_1.Strategy({
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: environment_js_1.JWT_SECRET,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma_client_js_1.prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        });
        if (!user || user.role !== 'ADMIN') {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, environment_js_1.JWT_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
exports.default = passport_1.default;
