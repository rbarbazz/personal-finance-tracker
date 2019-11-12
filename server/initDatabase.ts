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
    table.timestamps(true, true)
  });
};

export default () => {
  createUsers();
};
