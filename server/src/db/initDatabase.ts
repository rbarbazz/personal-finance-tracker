import Knex from 'knex'

import { Category } from './models'
import { getParentCategories } from '../controllers/categories'
import { knexConfig } from './knexfile'
import jsonCategories from './categories.json'

export const categories: {
  children: string[]
  title: string
}[] = jsonCategories
export const knex = Knex(knexConfig[process.env.NODE_ENV || 'development'])

const createUsers = async () => {
  if (await knex.schema.hasTable('users')) {
    return
  }

  await knex.schema.createTable('users', (table) => {
    table.increments()
    table.string('email')
    table.string('f_name')
    table.boolean('is_active')
    table.string('password')
    table.timestamps(true, true)
  })
}

const createCategories = async () => {
  if (await knex.schema.hasTable('categories')) {
    return
  }

  await knex.schema.createTable('categories', (table) => {
    table.increments()
    table.integer('parent_category_id')
    table.string('title')
  })

  await knex<Category>('categories').insert(
    categories.map((category) => ({
      parentCategoryId: 0,
      title: category.title,
    })),
  )

  const parentCategories = await getParentCategories()

  for (const parentCategory of parentCategories) {
    const parentCategoryIndex = categories.findIndex(
      (category) => category.title === parentCategory.title,
    )

    if (categories[parentCategoryIndex].children.length > 0) {
      await knex<Category>('categories').insert(
        categories[parentCategoryIndex].children.map((childCategory) => ({
          parentCategoryId: parentCategory.id,
          title: childCategory,
        })),
      )
    }
  }
}

const createOperations = async () => {
  if (await knex.schema.hasTable('operations')) {
    return
  }

  await knex.schema.createTable('operations', (table) => {
    table.increments()
    table.float('amount')
    table.integer('category_id')
    table.string('label')
    table.date('operation_date')
    table.integer('parent_category_id')
    table.integer('user_id')
  })
}

const createBudgets = async () => {
  if (await knex.schema.hasTable('budgets')) {
    return
  }

  await knex.schema.createTable('budgets', (table) => {
    table.increments()
    table.float('amount')
    table.date('budget_date')
    table.integer('category_id')
    table.integer('user_id')
  })
}

const createFireParams = async () => {
  if (await knex.schema.hasTable('fire_params')) {
    return
  }

  await knex.schema.createTable('fire_params', (table) => {
    table.increments()
    table.integer('age')
    table.float('expected_roi')
    table.integer('expenses')
    table.integer('incomes')
    table.integer('net_worth')
    table.float('savings_rate')
    table.integer('user_id')
  })
}

export default () => {
  createUsers()
  createCategories()
  createOperations()
  createBudgets()
  createFireParams()
}
