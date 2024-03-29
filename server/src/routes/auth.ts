import { Router } from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import sgMail from '@sendgrid/mail'
import NodeCache from 'node-cache'
import passport from 'passport'
import rateLimit from 'express-rate-limit'
import validator from 'validator'

import { emailVerifCache } from '../middlewares/passport'
import { getUser, insertUsers, updateUser } from '../controllers/users'

const PROD_URL = 'https://rbarbazz-finance.herokuapp.com/'
const DOMAIN = 'em7529.rbarbazz.com'

const loginLimiter = rateLimit({
  handler: (_req, res) =>
    res.status(401).send({
      error: true,
      message: 'Too many failed login attempts, please wait a few minutes',
    }),
  max: 15,
  windowMs: 5 * 60 * 1000,
})

const registerLimiter = rateLimit({
  handler: (_req, res) =>
    res.status(401).send({
      error: true,
      message: 'Too many registration attempts, please wait a few minutes',
    }),
  max: 15,
  windowMs: 5 * 60 * 1000,
})

const resetLimiter = rateLimit({
  handler: (_req, res) =>
    res.status(401).send({
      error: true,
      message: 'Too many password reset attempts, please wait a few minutes',
    }),
  max: 10,
  windowMs: 5 * 60 * 1000,
})

const passwordResetCache = new NodeCache()

export const sendEmailVerifLink = async (email: string) => {
  const token = jwt.sign(
    { email },
    process.env.JWT_VERIF_SECRET || 'really not a secret',
  )
  if (!process.env.SG_API_KEY) throw 'Sendgrid API key missing'

  const verificationUrl = `${
    process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : PROD_URL
  }/api/auth/email-verification/${token}`
  const msg = {
    to: email,
    from: `Personal Finance Tracker <noreply@${DOMAIN}>`,
    templateId: 'd-04169895452e4b328e421760733ae68f',
    dynamicTemplateData: {
      verification_url: verificationUrl,
    },
  }

  sgMail.setApiKey(process.env.SG_API_KEY)
  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(
      `An error has occurred while sending confirmation email to ${email}`,
    )
    console.error(error)
    throw error
  }
}

export const sendPasswordResetLink = async (email: string) => {
  const token = jwt.sign(
    { email },
    process.env.JWT_VERIF_SECRET || 'really not a secret',
    { expiresIn: '15m' },
  )
  if (!process.env.SG_API_KEY) throw 'Sendgrid API key missing'

  const resetUrl = `${
    process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : PROD_URL
  }/lost-password?token=${token}`
  const msg = {
    to: email,
    from: `Personal Finance Tracker <noreply@${DOMAIN}>`,
    templateId: 'd-70985b6208654f1a954021b0c5f0e69f',
    dynamicTemplateData: {
      reset_url: resetUrl,
    },
  }

  sgMail.setApiKey(process.env.SG_API_KEY)
  try {
    await sgMail.send(msg)
  } catch (error) {
    console.error(
      `An error has occurred while sending password reset email to ${email}`,
    )
    console.error(error)
    throw error
  }
}

export const authRouter = Router()

// Get current login status
authRouter.get(
  '/login',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    if (req.user) return res.send({ isLoggedIn: true, fName: req.user.fName })
    else return res.send({ isLoggedIn: false, fName: '' })
  },
)

// Logout
authRouter.get('/logout', (_req, res) => {
  res.cookie('token', '', { httpOnly: true })
  return res.send()
})

// Login
authRouter.post('/login', loginLimiter, (req, res) => {
  passport.authenticate('local', { session: false }, (err, user) => {
    if (err) return res.status(401).send({ error: true, message: err })
    if (!user)
      return res
        .status(401)
        .send({ error: true, message: 'Incorrect username or password' })

    const token = jwt.sign(
      { fName: user.fName, id: user.id },
      process.env.JWT_ACCESS_SECRET || 'not a secret',
      { expiresIn: '2h' },
    )

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
    return res.send({ error: false, message: '', token })
  })(req, res)
})

// Register
authRouter.post('/register', registerLimiter, async (req, res) => {
  const { email, fName, password } = req.body
  const user = await getUser(email)

  if (user.length > 0)
    return res.send({ error: true, message: 'Email already in use' })
  if (fName.length > 50)
    return res.send({ error: true, message: 'First name is too long' })
  if (fName.length < 1)
    return res.send({ error: true, message: 'First name is too short' })
  if (!validator.isAlpha(fName))
    return res.send({
      error: true,
      message: 'First name must only contain letters',
    })
  if (!validator.isEmail(email))
    return res.send({
      error: true,
      message: 'Please enter a valid email',
    })
  if (password.length < 12)
    return res.send({ error: true, message: 'Password minimum 12 characters' })

  bcrypt.hash(password, 10, async (error, hash) => {
    if (error) return res.send({ error: true, message: 'An error occurred' })

    const insertedUserId = await insertUsers(email, fName, hash)

    if (insertedUserId.length < 1)
      return res.send({ error: true, message: 'An error has occurred' })

    try {
      await sendEmailVerifLink(email)
      emailVerifCache.set(email, true, 15 * 60)
      return res.send({
        error: false,
        message: 'Please check your mailbox now',
      })
    } catch (error) {
      return res.send({
        error: true,
        message: 'An error has occurred',
      })
    }
  })
})

// Verify user email
authRouter.get('/email-verification/:token', async (req, res) => {
  const { token } = req.params

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_VERIF_SECRET || 'really not a secret',
    )
    if (typeof decoded !== 'object') return res.redirect('../../?verif=false')

    const { email } = decoded as { email: string }
    const user = await getUser(email)

    if (user.length === 1) {
      await updateUser(user[0].id, { email, isActive: true })
      return res.redirect('../../?verif=true')
    } else {
      return res.redirect('../../?verif=false')
    }
  } catch (err) {
    return res.redirect('../../?verif=false')
  }
})

// Update user with new password
authRouter.post('/reset-password', async (req, res) => {
  const { password, token } = req.body

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_VERIF_SECRET || 'really not a secret',
    )
    if (typeof decoded !== 'object')
      return res.send({ error: true, message: 'An error has occured' })

    const { email } = decoded as { email: string }
    const user = await getUser(email)

    if (user.length === 1) {
      if (password.length < 12)
        return res.send({
          error: true,
          message: 'Password minimum 12 characters',
        })

      bcrypt.hash(password, 10, async (error, hash) => {
        if (error)
          return res.send({ error: true, message: 'An error occurred' })

        await updateUser(user[0].id, { password: hash })

        return res.send({ error: false, message: '' })
      })
    } else {
      return res.send({ error: true, message: 'An error has occured' })
    }
  } catch (err) {
    return res.send({ error: true, message: 'An error has occured' })
  }
})

// Request a password reset link
authRouter.get('/reset-password', resetLimiter, async (req, res) => {
  const { email } = req.query

  const user = await getUser(email)

  if (user.length === 1) {
    if (!passwordResetCache.get(email)) {
      sendPasswordResetLink(email)
      passwordResetCache.set(email, true, 15 * 60)
    } else {
      return res.send({
        error: true,
        message: 'A reset link was recently sent already',
      })
    }
  }

  return res.send({
    error: false,
    message:
      'If an account is associated with this email, we will send a reset link',
  })
})
