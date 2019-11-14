import Knex from 'knex';

import { knexConfig } from './knexfile';

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
  });
  await knex<Category>('categories').insert([
    { title: 'Uncategorized' },
    { title: 'Groceries' },
    { title: 'Transport' },
    { title: 'Home' },
    { title: 'Eating/Drinking Out' },
    { title: 'Clothing' },
    { title: 'Holidays' },
  ]);
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
