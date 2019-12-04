import { Router } from 'express';

import { getParentCategories } from '../controllers/categories';
import { knex } from '../db/initDatabase';
import { MonthlyBarChartData } from '../../../client/src/components/Analytics/MonthlyBarChart';
import { Operation, Budget } from '../db/models';
import { BudgetLineChartData } from '../../../client/src/components/Analytics/BudgetLineChart';

export const chartsRouter = Router();

chartsRouter.get('/monthlybar', async (req: any, res) => {
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

      // Get the sum for each group of children
      const currentMonthSums = await knex<Operation>('operations')
        .select('categories.title')
        .sum('amount')
        .leftJoin('categories', {
          'operations.parentCategoryId': 'categories.id',
        })
        .where('userId', req.user.id)
        .andWhere('amount', '<', 0)
        .andWhereBetween('operationDate', [from, to])
        .groupBy('categories.title');

      monthlyBarChart.data.push({
        ...currentMonthSums.reduce((acc, cur) => {
          acc[cur.title] = Math.abs(cur.sum);
          return acc;
        }, {}),
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

chartsRouter.get('/treemap', async (req: any, res) => {
  if (req.user) {
    const treeMapChart: TreeMapChartNode = {
      categoryId: 0,
      title: 'Expenses',
      children: [],
    };
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const to = new Date(today.getFullYear(), today.getMonth(), 0);

    const lastMonthSums: {
      categoryId: number;
      parentCategoryId: number;
      sum: number;
      title: string;
    }[] = await knex<Operation>('operations')
      .select(
        'categories.id as categoryId',
        'categories.parentCategoryId',
        'categories.title',
      )
      .sum('operations.amount')
      .leftJoin('categories', {
        'operations.categoryId': 'categories.id',
      })
      .where('userId', req.user.id)
      .andWhere('amount', '<', 0)
      .andWhereBetween('operationDate', [from, to])
      .andWhereNot('operations.categoryId', 1)
      .groupBy('categories.id');

    const parentCategories = await getParentCategories();
    for (const parentCategory of parentCategories) {
      treeMapChart.children!.push({
        categoryId: parentCategory.id,
        children: [],
        title: parentCategory.title,
      });
    }

    for (const categorySum of lastMonthSums) {
      const parentCategoryIndex = treeMapChart.children!.findIndex(
        rootChild => rootChild.categoryId === categorySum.parentCategoryId,
      );
      if (
        treeMapChart.children &&
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

    return res.send({ treeMapChart });
  } else {
    return res.status(401).send();
  }
});

chartsRouter.get('/budgetline', async (req: any, res) => {
  if (req.user) {
    const budgetLineChart: BudgetLineChartData = [
      { id: 'Budget', data: [] },
      { id: 'Savings', data: [] },
      { id: 'Expenses', data: [] },
      { id: 'Incomes', data: [] },
    ];

    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0);
      const month = from.toLocaleString('default', { month: 'long' });

      const totalBudgets = await knex<Budget>('budgets')
        .sum('amount')
        .where('userId', req.user.id)
        .first();
      const monthTotalExpenses = await knex<Operation>('operations')
        .sum('amount')
        .where('userId', req.user.id)
        .andWhere('amount', '<', 0)
        .andWhereBetween('operationDate', [from, to])
        .first();
      const monthTotalIncomes = await knex<Operation>('operations')
        .sum('amount')
        .where('userId', req.user.id)
        .andWhere('amount', '>', 0)
        .andWhereBetween('operationDate', [from, to])
        .first();

      const monthlySavings =
        monthTotalExpenses && monthTotalIncomes
          ? Math.abs(monthTotalIncomes.sum) - Math.abs(monthTotalExpenses.sum)
          : 0;

      budgetLineChart[0].data.push({
        x: month,
        y: totalBudgets ? Math.abs(totalBudgets.sum) : 0,
      });
      budgetLineChart[1].data.push({
        x: month,
        y: monthlySavings > 0 ? monthlySavings.toFixed(2) : 0,
      });
      budgetLineChart[2].data.push({
        x: month,
        y: monthTotalExpenses ? Math.abs(monthTotalExpenses.sum) : 0,
      });
      budgetLineChart[3].data.push({
        x: month,
        y: monthTotalIncomes ? Math.abs(monthTotalIncomes.sum) : 0,
      });
    }

    return res.send({ budgetLineChart });
  } else {
    return res.status(401).send();
  }
});
