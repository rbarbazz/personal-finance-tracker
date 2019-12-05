import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import passportLocal from 'passport-local';
import path from 'path';
import session from 'express-session';

import { authRouter } from './routes/auth';
import { budgetsRouter } from './routes/budgets';
import { categoriesRouter } from './routes/categories';
import { analyticsRouter } from './routes/analytics';
import { operationsRouter } from './routes/operations';
import { User } from './db/models';
import initDatabase, { knex } from './db/initDatabase';

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
app.use('/analytics', analyticsRouter);
app.use('/budgets', budgetsRouter);
app.use('/categories', categoriesRouter);
app.use('/operations', operationsRouter);

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

passport.deserializeUser(async (id: User['id'], done) => {
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
