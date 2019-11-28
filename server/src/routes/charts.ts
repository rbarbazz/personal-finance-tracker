import { Router } from 'express';

import { getParentCategories } from '../controllers/categories';
import { knex } from '../db/initDatabase';
import { Operation } from '../db/models';

export const chartsRouter = Router();

export type MonthlyBarChartData = {
  data: object[];
  keys: string[];
};

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

export type TreeMapChartNode = {
  categoryId: number;
  children?: TreeMapChartNode[];
  sum?: number;
  title: string;
};

export type TreeMapChartRoot = {
  root: TreeMapChartNode;
};

chartsRouter.get('/treemap', async (req: any, res) => {
  if (req.user) {
    const treeMapChart: TreeMapChartRoot = {
      root: { categoryId: 0, title: 'Expenses', children: [] },
    };
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const to = new Date(today.getFullYear(), today.getMonth() - 1, 0);

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
      treeMapChart.root.children!.push({
        categoryId: parentCategory.id,
        children: [],
        title: parentCategory.title,
      });
    }

    for (const categorySum of lastMonthSums) {
      const parentCategoryIndex = treeMapChart.root.children!.findIndex(
        rootChild => rootChild.categoryId === categorySum.parentCategoryId,
      );
      if (
        treeMapChart.root &&
        treeMapChart.root.children &&
        treeMapChart.root.children[parentCategoryIndex] &&
        treeMapChart.root.children[parentCategoryIndex].children
      ) {
        treeMapChart.root.children[parentCategoryIndex].children!.push({
          categoryId: categorySum.categoryId,
          title: categorySum.title,
          sum: Math.abs(categorySum.sum),
        });
      }
    }

    treeMapChart.root.children = treeMapChart.root.children!.filter(
      parentCategory => parentCategory.children!.length > 0,
    );

    return res.send({ treeMapChart });
  } else {
    return res.status(401).send();
  }
});
