import { Router } from 'express';

import {
  getAllBudgets,
  getBudgetByCategory,
  insertBudgets,
  updateBudget,
} from '../controllers/budgets';
import {
  getCategoryById,
  getParentCategories,
} from '../controllers/categories';
import { BudgetCategoryType } from '../../../shared';

export const budgetsRouter = Router();

budgetsRouter.get('/', async (req, res) => {
  if (req.user) {
    let { selectedMonth, selectedYear } = req.query;
    const from = new Date(selectedYear, selectedMonth, 1);
    const to = new Date(selectedYear, selectedMonth, 2);

    const userBudgets = await getAllBudgets(from, to, req.user.id);
    const parentCategories = await getParentCategories();
    const budgets: BudgetCategoryType[] = [];

    for (const parentCategory of parentCategories) {
      if (parentCategory.title !== 'Income')
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

budgetsRouter.post('/', async (req, res) => {
  if (req.user) {
    const { categoryId, selectedMonth, selectedYear } = req.body;
    const from = new Date(selectedYear, selectedMonth, 1);
    const to = new Date(selectedYear, selectedMonth, 2);
    let { amount } = req.body;

    const category = await getCategoryById(categoryId);
    if (isNaN(categoryId) || category.length < 1)
      return res.send({ error: true, message: 'Wrong category' });
    if (amount < 0) amount = 0;

    const existingBudget = await getBudgetByCategory(
      categoryId,
      from,
      to,
      req.user.id,
    );

    const budgetDate = new Date(selectedYear, selectedMonth, 1);

    if (existingBudget.length > 0)
      await updateBudget(existingBudget[0].id, { amount, budgetDate });
    else
      await insertBudgets({
        amount,
        budgetDate,
        categoryId,
        userId: req.user.id,
      });

    return res.send({ error: false, message: '' });
  } else {
    res.status(401).send();
  }
});
