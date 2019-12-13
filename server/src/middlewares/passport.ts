import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { Request } from 'express';
import { getUser } from '../controllers/users';

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) token = req.cookies['token'];
  return token;
};

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await getUser(email);

      if (user.length < 1) return done(null, false);
      bcrypt.compare(password, user[0].password, (err, isCorrect) => {
        if (err || !isCorrect) return done(null, false);
        return done(null, user[0]);
      });
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.JWT_SECRET || 'not a secret',
    },
    async (jwtPayload, done) => {
      try {
        const user = await getUser('', jwtPayload.id);

        return done(null, user[0]);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
