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

export const getBudgetByCategory = async (
  categoryId: number,
  userId: number,
): Promise<Budget[]> => {
  return await knex<Budget>('budgets')
    .where('userId', userId)
    .andWhere('categoryId', categoryId);
};

export const insertBudgets = async (
  budgets: Partial<Budget> | Partial<Budget>[],
) => {
  return await knex<Budget>('budgets').insert(budgets);
};

export const updateBudgetById = async (
  budgetId: number,
  budget: Partial<Budget>,
) => {
  return await knex<Budget>('budgets')
    .where('id', budgetId)
    .update(budget);
};
