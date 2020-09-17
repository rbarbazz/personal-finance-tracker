import { Router } from 'express'
import bcrypt from 'bcrypt'
import validator from 'validator'

import { deleteBudgets } from '../controllers/budgets'
import { deleteOperations } from '../controllers/operations'
import { updateUser } from '../controllers/users'

export const usersRouter = Router()

// Update user's info
usersRouter.put('/', async (req, res) => {
  if (req.user) {
    const { user } = req
    const { fName, oldPwd, newPwd } = req.body

    if (oldPwd !== undefined && newPwd !== undefined) {
      bcrypt.compare(oldPwd, user.password, (cmpErr, isCorrect) => {
        if (cmpErr || !isCorrect)
          return res.send({
            error: true,
            message: 'Old password is incorrect',
          })
        if (newPwd.length < 12)
          return res.send({
            error: true,
            message: 'New password minimum 12 characters',
          })

        bcrypt.hash(newPwd, 10, async (hashErr, hash) => {
          if (hashErr)
            return res.send({ error: true, message: 'An error has occurred' })

          await updateUser(user.id, { password: hash })

          return res.send({ error: false, message: 'Password updated' })
        })
      })
    } else if (fName !== undefined) {
      if (fName.length > 50)
        return res.send({ error: true, message: 'First name is too long' })
      if (fName.length < 1)
        return res.send({ error: true, message: 'First name is too short' })
      if (!validator.isAlpha(fName))
        return res.send({
          error: true,
          message: 'First name must only contain letters',
        })

      await updateUser(user.id, { fName })

      return res.send({ error: false, message: 'First Name updated' })
    } else return res.send({ error: false, message: '' })
  } else {
    return res.status(401).send()
  }
})

// Reset user's profile
usersRouter.delete('/', async (req, res) => {
  if (req.user) {
    const { user } = req

    await deleteBudgets(user.id)
    await deleteOperations(user.id)

    return res.send({ error: true, message: 'Profile was reset' })
  } else {
    return res.status(401).send()
  }
})
