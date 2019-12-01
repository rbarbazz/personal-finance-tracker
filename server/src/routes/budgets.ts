import { Router } from 'express';

import { getBudgetsByUserId } from '../controllers/budgets';
import { getParentCategories } from '../controllers/categories';

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
