import { Operation } from '../db/models';
import { knex } from '../db/initDatabase';

export const getOperations = async (userId: number): Promise<Operation[]> =>
  await knex<Operation>('operations')
    .select(
      'operations.id',
      'operationDate',
      'amount',
      'label',
      'categories.title as categoryTitle',
      'categoryId',
    )
    .leftJoin('categories', { 'operations.categoryId': 'categories.id' })
    .where('userId', userId);

export const getOperation = async (operationId: number) =>
  await knex<Operation>('operations').where('id', operationId);

export const getMonthlyExpensesSumsForParents = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<{ title: string; sum: number }[]> =>
  await knex<Operation>('operations')
    .select('categories.title')
    .sum('amount')
    .leftJoin('categories', {
      'operations.parentCategoryId': 'categories.id',
    })
    .where('userId', userId)
    .andWhere('amount', '<', 0)
    .andWhereBetween('operationDate', [from, to])
    .groupBy('categories.title');

export const getMonthlyExpensesSumsForChildren = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<{
  categoryId: number;
  parentCategoryId: number;
  sum: number;
  title: string;
}[]> =>
  await knex<Operation>('operations')
    .select(
      'categories.id as categoryId',
      'categories.parentCategoryId',
      'categories.title',
    )
    .sum('operations.amount')
    .leftJoin('categories', {
      'operations.categoryId': 'categories.id',
    })
    .where('userId', userId)
    .andWhere('amount', '<', 0)
    .andWhereBetween('operationDate', [from, to])
    .andWhereNot('categories.parentCategoryId', 0)
    .groupBy('categories.id');

export const getMonthlyExpensesSum = async (
  from: Date,
  to: Date,
  userId: number,
) =>
  await knex<Operation>('operations')
    .sum('amount')
    .where('userId', userId)
    .andWhere('amount', '<', 0)
    .andWhereBetween('operationDate', [from, to])
    .first();

export const getMonthlyIncomesSum = async (
  from: Date,
  to: Date,
  userId: number,
) =>
  await knex<Operation>('operations')
    .sum('amount')
    .where('userId', userId)
    .andWhere('amount', '>', 0)
    .andWhereBetween('operationDate', [from, to])
    .first();

export const insertOperations = async (
  operations: Partial<Operation> | Partial<Operation>[],
) => await knex<Operation>('operations').insert(operations);

export const delOperation = async (operationId: number) =>
  await knex<Operation>('operations')
    .where('id', operationId)
    .del();

export const updateOperation = async (
  operationId: number,
  operation: Partial<Operation>,
) =>
  await knex<Operation>('operations')
    .where('id', operationId)
    .update(operation);
