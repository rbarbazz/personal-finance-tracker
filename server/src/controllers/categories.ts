import { knex } from '../db/initDatabase';
import { Category } from '../db/models';

export const getChildCategories = async () => {
  return await knex<Category>('categories').whereNot('parentCategoryId', 0);
};

export const getParentCategories = async () => {
  return await knex<Category>('categories').where('parentCategoryId', 0);
};

export const getCategoryById = async (categoryId: number) => {
  return await knex<Category>('categories').where('id', categoryId);
};