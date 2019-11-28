import { Router } from 'express';

import { knex } from '../db/initDatabase';
import { Operation, Category } from '../db/models';
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

    // Get all children category ids by parent category
    const childrenCategories: {
      parentTitle: string;
      childrenIds: number[];
    }[] = [];
    for (const parentCategory of parentCategories) {
      const categoryIds = (
        await knex<Category>('categories')
          .select('id')
          .where('parentCategoryId', parentCategory.id)
      ).map(categoryId => categoryId.id);

      childrenCategories.push({
        parentTitle: parentCategory.title,
        childrenIds: categoryIds,
      });
    }

    // Iterate on the last 6 months
    const today = new Date();
    for (let i = 2; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1);
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0);
      const month = from.toLocaleString('default', { month: 'long' });
      const currentMonthSums: { [index: string]: number } = {};

      // Get the sum for each group of children
      for (const children of childrenCategories) {
        const parentCategorySum = (
          await knex<Operation>('operations')
            .sum('amount')
            .leftJoin('categories', {
              'operations.categoryId': 'categories.id',
            })
            .where('userId', req.user.id)
            .whereIn('categories.id', children.childrenIds)
            .andWhere('amount', '<', 0)
            .andWhereBetween('operationDate', [from, to])
        )[0].sum;

        if (parentCategorySum !== null)
          currentMonthSums[children.parentTitle] = Math.abs(parentCategorySum);
      }
      if (Object.keys(currentMonthSums).length > 0)
        monthlyBarChart.data.push({ ...currentMonthSums, month });
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
