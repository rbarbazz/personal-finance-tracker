import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';
import path from 'path';
import validator from 'validator';

import initDatabase, { knex } from './initDatabase';

/**
 * Create DB and the tables if they are not present
 */
initDatabase();

/**
 * Init Express with the Passport middleware
 */
const app = express();
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

/**
 * Routes
 */

// Check current login status
app.get('/login', (req, res) => {
  if (req.user) {
    res.send({ userLoginStatus: true });
  } else {
    res.send({ userLoginStatus: false });
  }
});

// Login and Register routes
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({ error: false, message: '' });
});
app.post('/register', async (req, res) => {
  const { email, fName, password } = req.body;
  const user = await knex<User>('users')
    .where('email', email)
    .first();

  if (user) return res.send({ error: true, message: 'Email already in use' });
  if (fName.length > 50)
    return res.send({ error: true, message: 'First name is too long' });
  if (!validator.isAlpha(fName))
    return res.send({
      error: true,
      message: 'First name must only contain letters',
    });
  if (!validator.isEmail(email))
    return res.send({
      error: true,
      message: 'Please enter a valid email',
    });
  if (password.length < 12)
    return res.send({ error: true, message: 'Password is too short' });
  bcrypt.hash(password, 10, async (error, hash) => {
    if (error) return res.send({ error: true, message: 'An error occurred' });
    await knex<User>('users').insert({ email, fName, password: hash });

    res.send({
      accountCreated: true,
      error: false,
      message: 'Account created, you may now log in',
    });
  });
});

// Default
app.get('*', (req, res) => {
  res.sendFile(path.join(`${staticFolder}/index.html`));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
