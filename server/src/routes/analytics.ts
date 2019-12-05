import { Router } from 'express';

import {
  getMonthlyExpensesSums,
  getMonthlyExpensesSumsForChildren,
  getMonthlyExpensesSumsForParents,
  getMonthlyIncomesSums,
} from '../controllers/operations';
import { BudgetLineChartData } from '../../../client/src/components/Analytics/BudgetLineChart';
import { getAllBudgetsSum } from '../controllers/budgets';
import { getParentCategories } from '../controllers/categories';
import { MonthlyBarChartData } from '../../../client/src/components/Analytics/MonthlyBarChart';

export const analyticsRouter = Router();

analyticsRouter.get('/monthlybar', async (req: any, res) => {
  if (req.user) {
    const monthlyBarChart: MonthlyBarChartData = { keys: [], data: [] };
    const parentCategories = await getParentCategories();
    monthlyBarChart.keys = parentCategories.map(
      parentCategory => parentCategory.title,
    );

    // Iterate on the last 6 months
    const today = new Date();
    for (let i = 2; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0);
      const month = from.toLocaleString('default', { month: 'long' });

      const currentMonthSums = await getMonthlyExpensesSumsForParents(
        from,
        to,
        req.user.id,
      );

      monthlyBarChart.data.push({
        ...currentMonthSums.reduce((acc, curr) => {
          acc[curr.title] = Math.abs(curr.sum);
          return acc;
        }, {} as { [index: string]: number }),
        month,
      });
    }
    return res.send({ monthlyBarChart });
  } else {
    return res.status(401).send();
  }
});

export type TreeMapChartNode = {
  categoryId: number;
  children?: TreeMapChartNode[];
  sum?: number;
  title: string;
};

analyticsRouter.get('/treemap', async (req: any, res) => {
  if (req.user) {
    const treeMapChart: TreeMapChartNode = {
      categoryId: 0,
      title: 'Expenses',
      children: [],
    };
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const to = new Date(today.getFullYear(), today.getMonth(), 0);

    const lastMonthSums = await getMonthlyExpensesSumsForChildren(
      from,
      to,
      req.user.id,
    );

    // Add parent categories as direct children of the root
    const parentCategories = await getParentCategories();
    if (treeMapChart.children) {
      for (const parentCategory of parentCategories) {
        treeMapChart.children.push({
          categoryId: parentCategory.id,
          children: [],
          title: parentCategory.title,
        });
      }

      // Add child categories as direct children of their parent category
      for (const categorySum of lastMonthSums) {
        const parentCategoryIndex = treeMapChart.children.findIndex(
          rootChild => rootChild.categoryId === categorySum.parentCategoryId,
        );
        if (
          treeMapChart.children[parentCategoryIndex] &&
          treeMapChart.children[parentCategoryIndex].children
        ) {
          treeMapChart.children[parentCategoryIndex].children!.push({
            categoryId: categorySum.categoryId,
            title: categorySum.title,
            sum: Math.abs(categorySum.sum),
          });
        }
      }
    }

    return res.send({ treeMapChart });
  } else {
    return res.status(401).send();
  }
});

analyticsRouter.get('/budgetline', async (req: any, res) => {
  if (req.user) {
    const budgetLineChart: BudgetLineChartData = [
      { id: 'Budget', data: [] },
      { id: 'Savings', data: [] },
      { id: 'Expenses', data: [] },
      { id: 'Incomes', data: [] },
    ];
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 6, 1);
    const to = new Date(today.getFullYear(), today.getMonth(), 0);

    const totalBudgets = await getAllBudgetsSum(req.user.id);
    const monthlyExpensesSums = await getMonthlyExpensesSums(
      from,
      to,
      req.user.id,
    );
    const monthlyIncomesSums = await getMonthlyIncomesSums(
      from,
      to,
      req.user.id,
    );

    // Temporary until monthly budgets are implemented
    for (let i = 5; i >= 0; i--) {
      const currMonth = new Date(
        today.getFullYear(),
        today.getMonth() - i - 1,
        1,
      ).toLocaleString('default', { month: 'long' });
      budgetLineChart[0].data.push({
        x: currMonth,
        y: totalBudgets ? Math.abs(totalBudgets.sum) : 0,
      });
    }

    if (monthlyExpensesSums) budgetLineChart[2].data = monthlyExpensesSums;
    if (monthlyIncomesSums) budgetLineChart[3].data = monthlyIncomesSums;
    for (let i = 0; i < 6; i++) {
      let monthlyExpenses = 0,
        monthlyIncomes = 0,
        month = '';

      if (monthlyExpensesSums && monthlyExpensesSums[i]) {
        month = monthlyExpensesSums[i].x;
        monthlyExpenses = monthlyExpensesSums[i].y;
      }
      if (monthlyIncomesSums && monthlyIncomesSums[i]) {
        month = monthlyIncomesSums[i].x;
        monthlyIncomes = monthlyIncomesSums[i].y;
      }
      if (month !== '')
        budgetLineChart[1].data.push({
          x: month,
          y: +(monthlyIncomes - monthlyExpenses).toFixed(2),
        });
    }

    return res.send({ budgetLineChart });
  } else {
    return res.status(401).send();
  }
});
