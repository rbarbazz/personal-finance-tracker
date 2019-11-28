import Knex from 'knex';

import { Category } from './models';
import { getParentCategories } from '../controllers/categories';
import { knexConfig } from './knexfile';
import categoryTitlesJson from './categoryTitles.json';

const categoryTitles: { [index: string]: string[] } = categoryTitlesJson;
export const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

const createUsers = async () => {
  if (await knex.schema.hasTable('users')) {
    return;
  }

  await knex.schema.createTable('users', table => {
    table.increments();
    table.string('fName');
    table.string('email');
    table.string('password');
    table.timestamps(true, true);
  });
};

const createCategories = async () => {
  if (await knex.schema.hasTable('categories')) {
    return;
  }

  await knex.schema.createTable('categories', table => {
    table.increments();
    table.string('title');
    table.integer('parentCategoryId');
  });

  await knex<Category>('categories').insert(
    Object.keys(categoryTitles).map(parentCategoryTitle => ({
      title: parentCategoryTitle,
      parentCategoryId: 0,
    })),
  );

  const parentCategories = await getParentCategories();

  for (const parentCategory of parentCategories) {
    if (categoryTitles[parentCategory.title].length > 0) {
      await knex<Category>('categories').insert(
        categoryTitles[parentCategory.title].map(childCategory => ({
          title: childCategory,
          parentCategoryId: parentCategory.id,
        })),
      );
    }
  }
};

const createOperations = async () => {
  if (await knex.schema.hasTable('operations')) {
    return;
  }

  await knex.schema.createTable('operations', table => {
    table.increments();
    table.date('operationDate');
    table.float('amount');
    table.string('label');
    table.integer('categoryId');
    table.integer('userId');
    table.integer('parentCategoryId');
  });
};

export default () => {
  createUsers();
  createCategories();
  createOperations();
};
