import { Router } from 'express';

import { insertFireParams } from '../controllers/fire';

export const fireRouter = Router();

// Save fire params
fireRouter.post('/', async (req, res) => {
  if (req.user) {
    let {
      age,
      expectedRoi,
      expenses,
      incomes,
      netWorth,
      savingsRate,
    } = req.body;

    age = parseInt(age);
    if (isNaN(age) || age < 0 || age > 100)
      return res.send({ error: true, message: 'Age provided is incorrect' });
    expectedRoi = parseFloat(expectedRoi);
    if (isNaN(expectedRoi) || expectedRoi < 0 || expectedRoi > 100)
      return res.send({
        error: true,
        message: 'Expected ROI provided is incorrect',
      });
    expenses = parseInt(expenses);
    if (isNaN(expenses) || expenses < 0 || expenses >= 2147483647)
      return res.send({
        error: true,
        message: 'Expenses amount provided is incorrect',
      });
    incomes = parseInt(incomes);
    if (isNaN(incomes) || incomes < 0 || incomes >= 2147483647)
      return res.send({
        error: true,
        message: 'Incomes amount provided is incorrect',
      });
    netWorth = parseInt(netWorth);
    if (isNaN(netWorth) || netWorth <= -2147483648 || netWorth >= 2147483647)
      return res.send({
        error: true,
        message: 'Net Worth amount provided is incorrect',
      });
    savingsRate = parseFloat(savingsRate);
    if (isNaN(savingsRate) || savingsRate < 0 || savingsRate > 100)
      return res.send({
        error: true,
        message: 'Savings Rate provided is incorrect',
      });

    await insertFireParams({
      age,
      expectedRoi,
      expenses,
      incomes,
      netWorth,
      savingsRate,
      userId: req.user.id,
    });

    res.send({ error: false, message: 'Your current parameters were saved' });
  } else {
    res.status(401).send();
  }
});
