import { Router } from 'express'

import {
  getMonthlyExpensesSums,
  getMonthlyExpensesSumsForChildren,
  getMonthlyExpensesSumsForParents,
  getMonthlyIncomesSums,
  getMonthlySavingsSums,
} from '../controllers/operations'
import { getMonthlyBudgetsSums } from '../controllers/budgets'
import { getParentCategories } from '../controllers/categories'
import { BarChartData, LineChartData, TreeMapChartNode } from '../../../shared'

export const analyticsRouter = Router()

const initArrayWithMonths = (monthCount: number) => {
  const today = new Date()
  const ret = []

  for (let i = monthCount; i >= 0; i--) {
    const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1)
    const month = from.toLocaleString('default', { month: 'long' })

    ret.push({ x: month, y: 0 })
  }
  return ret
}

analyticsRouter.get('/monthlybar', async (req, res) => {
  if (req.user) {
    const monthlyBarChart: BarChartData = { keys: [], data: [] }
    const parentCategories = await getParentCategories()
    monthlyBarChart.keys = parentCategories.map(
      (parentCategory) => parentCategory.title,
    )

    // Iterate on the last 3 months
    const today = new Date()
    for (let i = 2; i >= 0; i--) {
      const from = new Date(today.getFullYear(), today.getMonth() - i - 1, 1)
      const to = new Date(today.getFullYear(), today.getMonth() - i, 0)
      const month = from.toLocaleString('default', { month: 'long' })

      const currentMonthSums = await getMonthlyExpensesSumsForParents(
        from,
        to,
        req.user.id,
      )

      if (currentMonthSums.length > 0)
        monthlyBarChart.data.push({
          ...currentMonthSums.reduce((acc, curr) => {
            acc[curr.title] = curr.sum
            return acc
          }, {} as { [index: string]: number }),
          month,
        })
    }

    return res.send({ monthlyBarChart })
  } else {
    return res.status(401).send()
  }
})

analyticsRouter.get('/treemap', async (req, res) => {
  if (req.user) {
    const treeMapChart: TreeMapChartNode = {
      categoryId: 0,
      title: 'Expenses',
      children: [],
    }
    const today = new Date()
    const from = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const to = new Date(today.getFullYear(), today.getMonth(), 0)

    const lastMonthSums = await getMonthlyExpensesSumsForChildren(
      from,
      to,
      req.user.id,
    )

    // Add parent categories as direct children of the root
    const parentCategories = await getParentCategories()
    if (treeMapChart.children) {
      for (const parentCategory of parentCategories) {
        treeMapChart.children.push({
          categoryId: parentCategory.id,
          children: [],
          title: parentCategory.title,
        })
      }

      // Add child categories as direct children of their parent category
      for (const categorySum of lastMonthSums) {
        const parentCategoryIndex = treeMapChart.children.findIndex(
          (rootChild) => rootChild.categoryId === categorySum.parentCategoryId,
        )
        if (
          treeMapChart.children[parentCategoryIndex] &&
          treeMapChart.children[parentCategoryIndex].children
        ) {
          treeMapChart.children[parentCategoryIndex].children!.push({
            categoryId: categorySum.categoryId,
            title: categorySum.title,
            sum: Math.round(Math.abs(categorySum.sum)),
          })
        }
      }
    }

    return res.send({ treeMapChart })
  } else {
    return res.status(401).send()
  }
})

analyticsRouter.get('/budgetline', async (req, res) => {
  if (req.user) {
    const budgetLineChart: LineChartData = [
      { id: 'Difference', data: initArrayWithMonths(5) },
      { id: 'Budget', data: initArrayWithMonths(5) },
      { id: 'Savings', data: initArrayWithMonths(5) },
      { id: 'Expenses', data: initArrayWithMonths(5) },
      { id: 'Incomes', data: initArrayWithMonths(5) },
    ]
    const today = new Date()
    const from = new Date(today.getFullYear(), today.getMonth() - 6, 1)
    const to = new Date(today.getFullYear(), today.getMonth(), 0)

    const monthlyExpensesSums = await getMonthlyExpensesSums(
      from,
      to,
      req.user.id,
    )
    const monthlySavingsSums = await getMonthlySavingsSums(
      from,
      to,
      req.user.id,
    )
    const monthlyIncomesSums = await getMonthlyIncomesSums(
      from,
      to,
      req.user.id,
    )
    const monthlyBudgetsSums = await getMonthlyBudgetsSums(
      from,
      to,
      req.user.id,
    )

    for (const sum of monthlyBudgetsSums) {
      const budgetLineChartIndex = budgetLineChart.findIndex(
        (elem) => elem.id === 'Budget',
      )
      const i = budgetLineChart[budgetLineChartIndex].data.findIndex(
        (month) => month.x === sum.x,
      )

      if (i) budgetLineChart[budgetLineChartIndex].data[i].y = sum.y
    }
    for (const sum of monthlySavingsSums) {
      const budgetLineChartIndex = budgetLineChart.findIndex(
        (elem) => elem.id === 'Savings',
      )
      const i = budgetLineChart[budgetLineChartIndex].data.findIndex(
        (month) => month.x === sum.x,
      )

      if (i) budgetLineChart[budgetLineChartIndex].data[i].y = -sum.y
    }
    for (const sum of monthlyExpensesSums) {
      const budgetLineChartIndex = budgetLineChart.findIndex(
        (elem) => elem.id === 'Expenses',
      )
      const i = budgetLineChart[budgetLineChartIndex].data.findIndex(
        (month) => month.x === sum.x,
      )

      if (i) budgetLineChart[budgetLineChartIndex].data[i].y = sum.y
    }
    for (const sum of monthlyIncomesSums) {
      const budgetLineChartIndex = budgetLineChart.findIndex(
        (elem) => elem.id === 'Incomes',
      )
      const i = budgetLineChart[budgetLineChartIndex].data.findIndex(
        (month) => month.x === sum.x,
      )

      if (i) budgetLineChart[budgetLineChartIndex].data[i].y = sum.y
    }
    for (let i = 0; i < 6; i++) {
      budgetLineChart[0].data[i].y = +(
        budgetLineChart[4].data[i].y - budgetLineChart[3].data[i].y
      ).toFixed(2)
    }

    return res.send({ budgetLineChart })
  } else {
    return res.status(401).send()
  }
})
