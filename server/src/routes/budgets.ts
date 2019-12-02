import { Router } from 'express';

import {
  getBudgetsByUserId,
  insertBudgets,
  getBudgetByCategory,
  updateBudgetById,
} from '../controllers/budgets';
import {
  getParentCategories,
  getCategoryById,
} from '../controllers/categories';

export const budgetsRouter = Router();

export type BudgetCategory = {
  amount: number;
  categoryId: number;
  title: string;
};

budgetsRouter.get('/', async (req: any, res) => {
  if (req.user) {
    const userBudgets = await getBudgetsByUserId(req.user.id);
    const parentCategories = await getParentCategories();
    const budgets: BudgetCategory[] = [];

    for (const parentCategory of parentCategories) {
      if (parentCategory.id !== 1)
        budgets.push({
          amount: 0,
          categoryId: parentCategory.id,
          title: parentCategory.title,
        });
    }
    for (const userBudget of userBudgets) {
      const index = budgets.findIndex(
        parentCategory => parentCategory.categoryId === userBudget.categoryId,
      );
      budgets[index].amount = userBudget.amount;
    }

    res.send({ budgets });
  } else {
    res.status(401).send();
  }
});

budgetsRouter.post('/', async (req: any, res) => {
  if (req.user) {
    const { categoryId } = req.body;
    let { amount } = req.body;

    const category = await getCategoryById(categoryId);
    if (isNaN(categoryId) || category.length < 1)
      return res.send({ error: true, message: 'Wrong category' });
    if (amount < 0) amount = 0;

    const existingBudget = await getBudgetByCategory(categoryId, req.user.id);

    if (existingBudget.length > 0)
      await updateBudgetById(existingBudget[0].id, { amount });
    else await insertBudgets({ amount, categoryId, userId: req.user.id });

    return res.send({ error: false, message: '' });
  } else {
    res.status(401).send();
  }
});
