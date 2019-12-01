import { Budget } from '../db/models';

import { knex } from '../db/initDatabase';

export const getBudgetsByUserId = async (userId: number): Promise<Budget[]> => {
  return await knex<Budget>('budgets')
    .select(
      'amount',
      'budgets.id',
      'categories.title as categoryTitle',
      'categoryId',
      'userId',
    )
    .leftJoin('categories', { 'budgets.categoryId': 'categories.id' })
    .where('userId', userId);
};
