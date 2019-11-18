import { Router } from 'express';

import { knex } from '../db/initDatabase';
import { Category, Operation } from '../db/models';

export const chartsRouter = Router();

/**
 * Charts
 */
chartsRouter.get('/charts', async (req: any, res) => {
  type chartData = {
    keys: string[];
    data: object[];
  };
  if (req.user) {
    const today = new Date();
    const monthlyBarChart: chartData = { keys: [], data: [] };
    monthlyBarChart.keys = (
      await knex<Category>('categories')
        .select('title')
        .whereNot('title', 'Uncategorized')
        .where('parentCategoryId', 0)
    ).map(category => category.title);

    for (let i = 6; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0);
      const month = from.toLocaleString('default', { month: 'long' });

      const sumsForMonth = await knex<Operation>('operations')
        .select('categories.title')
        .sum('amount')
        .join('categories', { 'operations.categoryId': 'categories.id' })
        .where('userId', req.user.id)
        .whereBetween('operationDate', [from, to])
        .whereNot('categories.title', 'Uncategorized')
        .groupBy('categories.title');

      if (sumsForMonth.length > 0) {
        let currentMonth: { [index: string]: number } = {};

        sumsForMonth.forEach(category => {
          currentMonth[category.title] = Math.abs(category.sum);
        });
        monthlyBarChart.data.push({ ...currentMonth, month });
      }
    }
    return res.send({ charts: { monthlyBarChart } });
  } else {
    return res.status(401).send();
  }
});
