import { knex, categories } from '../db/initDatabase'
import { Category } from '../db/models'

export const getChildCategories = async () =>
  await knex<Category>('categories').whereNot('parentCategoryId', 0)

export const getChildCategoriesWithParent = async () => {
  const childCategories = await knex<Category>('categories').whereNot(
    'parentCategoryId',
    0,
  )

  return childCategories.map((childCategory) => {
    const parentCategory = categories.find((parentCategory) =>
      parentCategory.children.includes(childCategory.title),
    )
    if (parentCategory)
      return { ...childCategory, parentCategoryTitle: parentCategory.title }
    return childCategory
  })
}

export const getParentCategories = async () =>
  await knex<Category>('categories').where('parentCategoryId', 0)

export const getCategoryById = async (categoryId: number) =>
  await knex<Category>('categories').where('id', categoryId)
