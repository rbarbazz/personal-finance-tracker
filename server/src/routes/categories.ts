import { Router } from 'express';

import { getChildCategories } from '../controllers/categories';

export const categoriesRouter = Router();

// Get all child categories
categoriesRouter.get('/', async (req, res) => {
  if (req.user) {
    const categories = await getChildCategories();

    res.send({ categories });
  } else {
    res.status(401).send();
  }
});
