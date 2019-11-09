import bodyParser from 'body-parser';
import express from 'express';
import Knex from 'knex';
import passport from 'passport';

import { knexConfig } from './knexfile';

// Init Knex
const knex = Knex(knexConfig[process.env.NODE_ENV || 'development']);

const createSchema = async () => {
  if (await knex.schema.hasTable('users')) {
    return;
  }

  await knex.schema.createTable('users', table => {
    table.increments();
    table.string('fName');
    table.string('email');
    table.string('password');
  });
};
createSchema();

// Init Express
const app = express();
app.use(bodyParser.json());
const port = process.env.port || 8080;

// Login/Register route
app.post('/login', (req, res) => {
  console.log(req.body);
  res.send();
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
