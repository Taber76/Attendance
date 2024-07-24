import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';

import { prisma } from '../config/prisma.client.js';
import { JWT_SECRET } from '../config/environment.js';

passport.use(
  'userJWT',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        if (!payload.id) {
          return done(null, false);
        }
        return done(null, payload);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

passport.use(
  'adminJWT',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await prisma.user.findUnique({
          where: {
            id: payload.id,
          },
        });
        if (!user || user.role !== 'ADMIN') {
          return done(null, false);
        }
        return done(null, user);
      } catch (error: any) {
        return done(error);
      }
    }
  )
);

export const generateToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1h' });
}


export default passport;
