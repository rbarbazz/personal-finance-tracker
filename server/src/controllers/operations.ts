import { Operation } from '../db/models';
import { knex } from '../db/initDatabase';

export const getOperationsByUserId = async (
  userId: number,
): Promise<Operation[]> => {
  return await knex<Operation>('operations')
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
};

export const getOperationById = async (operationId: number) => {
  return await knex<Operation>('operations').where('id', operationId);
};

export const insertOperations = async (
  operations: Partial<Operation> | Partial<Operation>[],
) => {
  return await knex<Operation>('operations').insert(operations);
};

export const delOperationById = async (operationId: number) => {
  return await knex<Operation>('operations')
    .where('id', operationId)
    .del();
};

export const updateOperationById = async (
  operationId: number,
  operation: Partial<Operation>,
) => {
  return await knex<Operation>('operations')
    .where('id', operationId)
    .update(operation);
};
