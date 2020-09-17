import { Router } from 'express'

import { getChildCategoriesWithParent } from '../controllers/categories'

export const categoriesRouter = Router()

// Get all child categories
categoriesRouter.get('/', async (req, res) => {
  if (req.user) {
    const categories = await getChildCategoriesWithParent()

    res.send({ categories })
  } else {
    res.status(401).send()
  }
})
