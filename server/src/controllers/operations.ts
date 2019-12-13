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
    .select('categories.title', knex.raw('abs(sum(amount)) as sum'))
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

export const getMonthlyExpensesSums = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<{ x: string; y: number }[]> =>
  await knex<Operation>('operations')
    .select(
      knex.raw("to_char(operation_date, 'FMMonth') as x"),
      knex.raw('abs(sum(amount)) as y'),
    )
    .where('userId', userId)
    .andWhere('amount', '<', 0)
    .andWhereBetween('operationDate', [from, to])
    .groupBy('x')
    .orderByRaw('min(operation_date)');

export const getMonthlyIncomesSums = async (
  from: Date,
  to: Date,
  userId: number,
): Promise<{ x: string; y: number }[]> =>
  await knex<Operation>('operations')
    .select(
      knex.raw("to_char(operation_date, 'FMMonth') as x"),
      knex.raw('sum(amount) as y'),
    )
    .where('userId', userId)
    .andWhere('amount', '>', 0)
    .andWhereBetween('operationDate', [from, to])
    .groupBy('x')
    .orderByRaw('min(operation_date)');

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

export const deleteOperations = async (userId: number) =>
  await knex<Operation>('operations')
    .where('userId', userId)
    .del();
