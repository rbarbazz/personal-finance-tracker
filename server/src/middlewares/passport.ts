import { Strategy as JwtStrategy } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcrypt';
import passport from 'passport';

import { knex } from '../db/initDatabase';
import { Request } from 'express';
import { User } from '../db/models';

const cookieExtractor = (req: Request) => {
  let token = null;

  if (req && req.cookies) token = req.cookies['token'];
  return token;
};

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      const user = await knex<User>('users')
        .where('email', email)
        .first();

      if (!user) return done(null, false);
      bcrypt.compare(password, user.password, (err, res) => {
        if (err || !res) return done(null, false);
        return done(null, user);
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
        const user = await knex<User>('users')
          .where('id', jwtPayload.id)
          .first();

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
