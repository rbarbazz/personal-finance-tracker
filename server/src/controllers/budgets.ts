import { Budget } from '../db/models';

import { knex } from '../db/initDatabase';

export const getAllBudgets = async (userId: number): Promise<Budget[]> =>
  await knex<Budget>('budgets')
    .select(
      'amount',
      'budgets.id',
      'categories.title as categoryTitle',
      'categoryId',
      'userId',
    )
    .leftJoin('categories', { 'budgets.categoryId': 'categories.id' })
    .where('userId', userId);

export const getBudgetByCategory = async (
  categoryId: number,
  userId: number,
): Promise<Budget[]> =>
  await knex<Budget>('budgets')
    .where('userId', userId)
    .andWhere('categoryId', categoryId);

export const insertBudgets = async (
  budgets: Partial<Budget> | Partial<Budget>[],
) => await knex<Budget>('budgets').insert(budgets);

export const updateBudget = async (budgetId: number, budget: Partial<Budget>) =>
  await knex<Budget>('budgets')
    .where('id', budgetId)
    .update(budget);

export const getAllBudgetsSum = async (userId: number) =>
  await knex<Budget>('budgets')
    .sum('amount')
    .where('userId', userId)
    .first();
