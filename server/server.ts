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

// Logout
app.get('/logout', (req, res) => {
  req.logout();
  res.send();
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

// Get all categories
app.get('/categories', async (req, res) => {
  if (req.user) {
    const categories = await knex<Category>('categories').select();

    res.send({ categories });
  } else {
    res.status(401).send();
  }
});

// Add an operation
app.post('/operations', async (req: any, res) => {
  if (req.user) {
    const {
      operationDate: operationDateStr,
      amount,
      label,
      categoryId,
    } = req.body;
    const operationDate = new Date(operationDateStr);

    if (isNaN(operationDate.getDate()))
      return res.send({ error: true, message: 'Wrong date' });
    if (isNaN(amount) || amount == 0)
      return res.send({ error: true, message: 'Wrong amount' });
    if (label.length < 1)
      return res.send({ error: true, message: 'Label is too short' });
    if (label.length > 255)
      return res.send({ error: true, message: 'Label is too long' });
    if (isNaN(categoryId))
      return res.send({ error: true, message: 'Wrong category' });

    await knex<Operation>('operations').insert({
      operationDate,
      amount,
      label,
      categoryId,
      userId: req.user.id,
    });

    res.send({ error: false, message: '' });
  } else {
    res.status(401).send();
  }
});

// Default
app.get('*', (req, res) => {
  res.sendFile(path.join(`${staticFolder}/index.html`));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
