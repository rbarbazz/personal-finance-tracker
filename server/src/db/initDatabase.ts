import Knex from 'knex';

import { knexConfig } from './knexfile';
import { CategoryDB } from './models';
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

  await knex<CategoryDB>('categories').insert(
    Object.keys(categoryTitles).map(parentCategoryTitle => ({
      title: parentCategoryTitle,
      parentCategoryId: 0,
    })),
  );

  const parentCategories = await knex<CategoryDB>('categories').select();
  parentCategories.forEach(async parentCategory => {
    if (categoryTitles[parentCategory.title].length > 0) {
      await knex<CategoryDB>('categories').insert(
        categoryTitles[parentCategory.title].map(childCategory => ({
          title: childCategory,
          parentCategoryId: parentCategory.id,
        })),
      );
    }
  });
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
  });
};

export default () => {
  createUsers();
  createCategories();
  createOperations();
};
