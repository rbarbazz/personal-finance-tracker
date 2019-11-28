import { Router } from 'express';

import { knex } from '../db/initDatabase';
import { Operation } from '../db/models';
import { getParentCategories } from '../controllers/categories';

export const chartsRouter = Router();

type MonthlyBarChartData = {
  keys: string[];
  data: object[];
};

/**
 * Charts
 */
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

      if (currentMonthSums.length > 0)
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

chartsRouter.get('/treemap', async (req: any, res) => {
  return res.send({
    treeMapChart: { root: { title: 'Expenses', children: [] } },
  });
});
