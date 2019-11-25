import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import validator from 'validator';

import { knex } from '../db/initDatabase';
import { UserDB } from '../db/models';

export const authRouter = Router();

/**
 * Authentication routes
 */
// Get current login status
authRouter.get('/login', async (req: any, res) => {
  if (req.user) {
    const user = await knex<UserDB>('users')
      .where('id', req.user.id)
      .first();

    if (user) res.send({ isLoggedIn: true, fName: user.fName });
    else res.send({ isLoggedIn: true, fName: '' });
  } else {
    res.send({ isLoggedIn: false, fName: '' });
  }
});

// Logout
authRouter.get('/logout', (req, res) => {
  req.logout();
  res.send();
});

// Login
authRouter.post(
  '/login',
  passport.authenticate('local'),
  async (req: any, res) => {
    const user = await knex<UserDB>('users')
      .where('id', req.user.id)
      .first();

    if (user) res.send({ error: false, fName: user.fName, message: '' });
    else res.send({ error: false, fName: '', message: '' });
  },
);

// Register
authRouter.post('/register', async (req, res) => {
  const { email, fName, password } = req.body;
  const user = await knex<UserDB>('users')
    .where('email', email)
    .first();

  if (user) return res.send({ error: true, message: 'Email already in use' });
  if (fName.length > 50)
    return res.send({ error: true, message: 'First name is too long' });
  if (fName.length < 1)
    return res.send({ error: true, message: 'First name is too short' });
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
    await knex<UserDB>('users').insert({ email, fName, password: hash });

    res.send({
      accountCreated: true,
      error: false,
      message: 'Account created, you may now log in',
    });
  });
});
