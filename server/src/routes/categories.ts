import { Router } from 'express';

import { knex } from '../db/initDatabase';
import { CategoryDB } from '../db/models';

export const categoriesRouter = Router();

/**
 * Categories
 */
// Get all categories
categoriesRouter.get('/', async (req, res) => {
  if (req.user) {
    const categories = await knex<CategoryDB>('categories')
      .whereNot('parentCategoryId', 0)
      .orderBy('title');

    res.send({ categories });
  } else {
    res.status(401).send();
  }
});
