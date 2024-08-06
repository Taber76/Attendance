var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import PostgreDAO from "../dao/postgre.dao.js";
import { JWT_SECRET } from '../config/environment.js';
passport.use('userJWT', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
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
passport.use('adminJWT', new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
}, (payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postgreDAOInstance = yield PostgreDAO.getInstance();
        const user = yield postgreDAOInstance.getFromTable('users', { id: payload.id }, ['id', 'role']);
        if (!user || user[0].role !== 'ADMIN') {
            return done(null, false);
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
})));
export const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
};
export default passport;
