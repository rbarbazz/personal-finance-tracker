import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mailgun from 'mailgun-js';
import passport from 'passport';
import validator from 'validator';

import { getUser, insertUsers, updateUser } from '../controllers/users';

const sendEmailVerifLink = async (userEmail: string, token: string) => {
  if (!process.env.MG_API_KEY) throw 'Mailgun API key missing';

  const verificationUrl = `${
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : ''
  }/api/auth/email-verification/${token}`;
  const DOMAIN = 'sandbox20f42a2c714a4db4b5cf46eecb3702f5.mailgun.org';
  const mg = mailgun({ apiKey: process.env.MG_API_KEY, domain: DOMAIN });
  const data = {
    from:
      'Mailgun Sandbox <postmaster@sandbox20f42a2c714a4db4b5cf46eecb3702f5.mailgun.org>',
    to: 'raphael.barbazza@gmail.com',
    subject: '[Monthly Budget Planner] - Please verify your email',
    template: 'email_verification',
    text: `Monthly Budget Planner\nThanks for using Monthly Budget Planner!\nYou're only one step away to start your financial independance journey.\nPlease confirm your email address by following the link below.\n${verificationUrl}`,
    'v:verification_url': verificationUrl,
  };

  try {
    await mg.messages().send(data);
  } catch (error) {
    console.error(
      `An error has occurred while sending confirmation email to ${userEmail}`,
    );
    console.error(error);
    throw error;
  }
};

export const authRouter = Router();

// Get current login status
authRouter.get(
  '/login',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user) return res.send({ isLoggedIn: true, fName: req.user.fName });
    else return res.send({ isLoggedIn: false, fName: '' });
  },
);

// Logout
authRouter.get('/logout', (_req, res) => {
  res.cookie('token', '', { httpOnly: true });
  return res.send();
});

// Login
authRouter.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return res.status(401).send({ error: true, message: err });
    if (!user)
      return res
        .status(401)
        .send({ error: true, message: 'Incorrect username or password' });

    const token = jwt.sign(
      { fName: user.fName, id: user.id },
      process.env.JWT_ACCESS_SECRET || 'not a secret',
      { expiresIn: '2h' },
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
  const user = await getUser(email);

  if (user.length > 0)
    return res.send({ error: true, message: 'Email already in use' });
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

    const insertedUserId = await insertUsers(email, fName, hash);

    if (insertedUserId.length < 1)
      return res.send({ error: true, message: 'An error has occurred' });

    const token = jwt.sign(
      { email },
      process.env.JWT_VERIF_SECRET || 'really not a secret',
    );

    try {
      await sendEmailVerifLink(email, token);
      return res.send({
        error: false,
        message: 'Please check your mailbox now',
      });
    } catch (error) {
      return res.send({
        error: true,
        message: 'An error has occurred',
      });
    }
  });
});

// Verify user email
authRouter.get('/email-verification/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_VERIF_SECRET || 'really not a secret',
    );
    if (typeof decoded !== 'object') return res.redirect('../../?verif=false');

    const { email } = decoded as { email: string };
    const user = await getUser(email);

    if (user.length > 0) {
      await updateUser(user[0].id, { email, isActive: true });
      return res.redirect('../../?verif=true');
    } else {
      return res.redirect('../../?verif=false');
    }
  } catch (err) {
    return res.redirect('../../?verif=false');
  }
});
