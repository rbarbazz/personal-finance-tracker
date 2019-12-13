import { Router } from 'express';
import bcrypt from 'bcrypt';

import { updateUser } from '../controllers/users';

export const usersRouter = Router();

// Update user's info
usersRouter.put('/', async (req, res) => {
  if (req.user) {
    const { user } = req;
    const { oldPwd, newPwd } = req.body;

    if (oldPwd !== undefined && newPwd !== undefined) {
      bcrypt.compare(oldPwd, user.password, (cmpErr, isCorrect) => {
        if (cmpErr || !isCorrect)
          return res.send({
            error: true,
            message: 'Old password is incorrect',
          });
        if (newPwd.length < 12)
          return res.send({
            error: true,
            message: 'New password minimum 12 characters',
          });

        bcrypt.hash(newPwd, 10, async (hashErr, hash) => {
          if (hashErr)
            return res.send({ error: true, message: 'An error has occurred' });

          await updateUser(user.id, { password: hash });

          return res.send({ error: false, message: 'Password updated' });
        });
      });
    } else return res.send();
  } else {
    return res.status(401).send();
  }
});
