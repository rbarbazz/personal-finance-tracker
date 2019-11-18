import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import path from 'path';

import initDatabase, { knex } from './db/initDatabase';
import { User } from './db/models';
import { authRouter } from './routes/auth';
import { operationsRouter } from './routes/operations';
import { categoriesRouter } from './routes/categories';
import { chartsRouter } from './routes/charts';

/**
 * Create DB and the tables if they are not present
 */
initDatabase();

/**
 * Init Express with the Passport middleware
 */
export const app = express();
const port = process.env.port || 8080;
const staticFolder = __dirname + '/../client/build';

app.use(express.static(staticFolder));
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET || 'not a secret',
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use('/', authRouter);
app.use('/', operationsRouter);
app.use('/', categoriesRouter);
app.use('/', chartsRouter);

/**
 * Passport middleware
 */
const LocalStrategy = passportLocal.Strategy;

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

passport.serializeUser((user: User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  const user = await knex<User>('users')
    .where('id', id)
    .first();
  done(null, user);
});

// Default route
app.get('*', (_req, res) => {
  if (process.env.NODE_ENV === 'development') return res.send();

  return res.sendFile(path.join(`${staticFolder}/index.html`));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
