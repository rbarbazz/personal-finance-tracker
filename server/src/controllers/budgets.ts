import { Budget } from '../db/models'

import { knex } from '../db/initDatabase'

export const getAllBudgets = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<Budget[]> =>
  await knex<Budget>('budgets')
    .select(
      'amount',
      'budgets.id',
      'categories.title as categoryTitle',
      'categoryId',
      'userId',
    )
    .leftJoin('categories', { 'budgets.categoryId': 'categories.id' })
    .where('userId', userId)
    .andWhereBetween('budgetDate', [from, to])

export const getMonthlyBudgetsSums = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<{ x: string; y: number }[]> =>
  await knex<Budget>('budgets')
    .select(
      knex.raw("to_char(budget_date, 'FMMonth') as x"),
      knex.raw('abs(sum(amount)) as y'),
    )
    .where('userId', userId)
    .andWhereBetween('budgetDate', [from, to])
    .groupBy('x')
    .orderByRaw('min(budget_date)')

export const getBudgetByCategory = async (
  categoryId: number,
  from: Date,
  to: Date,
  userId: number,
): Promise<Budget[]> =>
  await knex<Budget>('budgets')
    .where('userId', userId)
    .andWhere('categoryId', categoryId)
    .andWhereBetween('budgetDate', [from, to])

export const getLatestBudgets = async (userId: number) =>
  await knex<Budget>('budgets')
    .select('amount', 'budgetDate', 'categoryId', 'userId')
    .where('userId', userId)
    .limit(9)
    .orderBy('budgetDate', 'desc')

export const insertBudgets = async (
  budgets: Partial<Budget> | Partial<Budget>[],
) => await knex<Budget>('budgets').insert(budgets)

export const updateBudget = async (budgetId: number, budget: Partial<Budget>) =>
  await knex<Budget>('budgets').where('id', budgetId).update(budget)

export const deleteBudgets = async (userId: number) =>
  await knex<Budget>('budgets').where('userId', userId).del()
