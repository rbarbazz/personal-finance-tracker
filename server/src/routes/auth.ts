import { Router } from 'express';
import bcrypt from 'bcrypt';
import passport from 'passport';
import validator from 'validator';
import jwt from 'jsonwebtoken';

import { knex } from '../db/initDatabase';
import { User } from '../db/models';

export const authRouter = Router();

/**
 * Authentication routes
 */
// Get current login status
authRouter.get(
  '/login',
  passport.authenticate('jwt', { session: false }),
  async (req: any, res) => {
    if (req.user) res.send({ isLoggedIn: true, fName: req.user.fName });
    else res.send({ isLoggedIn: false, fName: '' });
  },
);

// Logout
authRouter.get('/logout', (_req, res) => {
  res.cookie('token', '', { httpOnly: true });
  res.send();
});

// Login
authRouter.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err || !user) res.status(401).send();

    const token = jwt.sign(
      { fName: user.fName, id: user.id },
      process.env.JWT_SECRET || 'not a secret',
      { expiresIn: '12h' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.send({ error: false, message: '', token });
  })(req, res);
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
    return res.send({ error: true, message: 'Password minimum 12 characters' });

  bcrypt.hash(password, 10, async (error, hash) => {
    if (error) return res.send({ error: true, message: 'An error occurred' });

    const insertedUserId = await knex<User>('users')
      .returning('id')
      .insert({ email, fName, password: hash });

    if (insertedUserId.length < 1)
      return res.send({ error: true, message: 'An error has occurred' });

    const token = jwt.sign(
      { fName, id: insertedUserId[0] },
      process.env.JWT_SECRET || 'not a secret',
      { expiresIn: '12h' },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });
    return res.send({ error: false, message: '', token });
  });
});
