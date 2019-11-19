import { Router } from 'express';

import { knex } from '../db/initDatabase';
import { Operation, Category, CategoryDB } from '../db/models';

export const chartsRouter = Router();
type chartData = {
  keys: string[];
  data: object[];
};

/**
 * Charts
 */
chartsRouter.get('/', async (req: any, res) => {
  if (req.user) {
    const today = new Date();
    const monthlyBarChart: chartData = { keys: [], data: [] };
    const parentCategories: CategoryDB[] = await knex<CategoryDB>('categories')
      .whereNot('title', 'Uncategorized')
      .where('parentCategoryId', 0);
    monthlyBarChart.keys = parentCategories.map(
      parentCategory => parentCategory.title,
    );

    // Iterate on the last 6 months
    for (let i = 5; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0);
      const month = from.toLocaleString('default', { month: 'long' });
      const currentMonthSums: { [index: string]: number } = {};

      // Get the sum for each parent category
      for (const parentCategory of parentCategories) {
        const categoryIds = (
          await knex<Category>('categories')
            .select('id')
            .where('parentCategoryId', parentCategory.id)
        ).map(categoryId => categoryId.id);
        const parentCategorySum = (
          await knex<Operation>('operations')
            .sum('amount')
            .leftJoin('categories', {
              'operations.categoryId': 'categories.id',
            })
            .where('userId', req.user.id)
            .whereIn('categories.id', categoryIds)
            .andWhere('amount', '<', 0)
            .andWhereBetween('operationDate', [from, to])
        )[0].sum;

        if (parentCategorySum !== null)
          currentMonthSums[parentCategory.title] = Math.abs(parentCategorySum);
      }
      monthlyBarChart.data.push({ ...currentMonthSums, month });
    }
    return res.send({ charts: { monthlyBarChart } });
  } else {
    return res.status(401).send();
  }
});
