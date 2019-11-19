import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import validator from 'validator';

import { knex } from '../db/initDatabase';
import { User } from '../db/models';

export const authRouter = Router();

/**
 * Authentication routes
 */
// Get current login status
authRouter.get('/login', (req, res) => {
  if (req.user) {
    res.send({ userLoginStatus: true });
  } else {
    res.send({ userLoginStatus: false });
  }
});

// Logout
authRouter.get('/logout', (req, res) => {
  req.logout();
  res.send();
});

// Login
authRouter.post('/login', passport.authenticate('local'), (_req, res) => {
  res.send({ error: false, message: '' });
});

// Register
authRouter.post('/register', async (req, res) => {
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
