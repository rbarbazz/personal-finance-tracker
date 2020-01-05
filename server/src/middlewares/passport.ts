import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import NodeCache from 'node-cache';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { Request } from 'express';
import { getUser } from '../controllers/users';
import { sendEmailVerifLink } from '../routes/auth';

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) token = req.cookies['token'];
  return token;
};

export const emailVerifCache = new NodeCache();

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await getUser(email);

      if (user.length < 1) return done('Incorrect username or password', false);
      if (!user[0].isActive) {
        if (!emailVerifCache.get(email)) {
          sendEmailVerifLink(email);
          emailVerifCache.set(email, true, 15 * 60);
        }
        return done(
          'A verification link was sent, please check your inbox',
          false,
        );
      }

      bcrypt.compare(password, user[0].password, (err, isCorrect) => {
        if (err) return done('An error has occurred', false);
        if (!isCorrect) return done('Incorrect username or password', false);

        return done(null, user[0]);
      });
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_ACCESS_SECRET || 'not a secret',
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUser('', jwtPayload.id);

        if (user.length < 1) return done(null, false);
        if (!user[0].isActive) return done(null, false);

        return done(null, user[0]);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
