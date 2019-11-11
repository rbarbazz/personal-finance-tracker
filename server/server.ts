import bodyParser from 'body-parser';
import express from 'express';
import session from 'express-session';
import passport from 'passport';
import passportLocal from 'passport-local';
import bcrypt from 'bcrypt';

import initDatabase, { knex } from './initDatabase';

// Init DB
initDatabase();

// Init Express
const app = express();
const port = process.env.port || 8080;

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

// Auth
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

// Routes
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.send({});
});

app.post('/register', async (req, res) => {
  const { email, fName, password } = req.body;
  const user = await knex<User>('users')
    .where('email', email)
    .first();

  if (user) return res.send({ error: true, message: 'Email already in use' });

  bcrypt.hash(password, 10, async (err, hash) => {
    if (err) return res.send({ error: true, message: 'An error occurred' });

    await knex<User>('users').insert({ email, fName, password: hash });
    res.send({});
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
