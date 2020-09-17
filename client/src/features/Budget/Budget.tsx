import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useCallback } from 'react'

import './Budget.scss'
import { ActionBar } from '../../common/ActionBar'
import { BudgetPieChart } from './BudgetPieChart'
import { BudgetTable } from './BudgetTable'
import { getBudgets } from './budgetStore'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { MonthPicker } from './MonthPicker'
import { SectionHeader } from '../../common/SectionHeader'
import { State } from '../../app/rootReducer'

export const Budget: React.FC = () => {
  const dispatch = useDispatch()
  const selectedMonth = useSelector(
    (state: State) => state.budgets.selectedMonth,
  )
  const budgets = useSelector((state: State) => state.budgets.budgets)
  const isFetchingBudgets = useSelector(
    (state: State) => state.budgets.isFetchingBudgets,
  )
  const budgetTotal = budgets.reduce((a, b) => a + b.amount, 0)
  const getInitialBudgets = useCallback(
    () => dispatch(getBudgets(selectedMonth)),
    [dispatch, selectedMonth],
  )

  useEffect(() => {
    getInitialBudgets()
  }, [getInitialBudgets])

  return (
    <div className="page-container">
      <ActionBar />
      <div className="content-container">
        <div className="budget-header">
          <SectionHeader
            subtitle={`Set your monthly goals by category. You can use the "Uncategorized" category to match the total goal you want to achieve.`}
            title="Monthly Budget"
          />
          <MonthPicker selectedMonth={selectedMonth} />
        </div>
        <div className="inner-content-container">
          <div className="budget-col">
            <BudgetTable budgets={budgets} isLoading={isFetchingBudgets} />
          </div>
          <div className="budget-col">
            <BudgetPieChart
              isLoading={isFetchingBudgets}
              root={budgets}
              total={budgetTotal}
            />
            <div className="generic-card">
              {isFetchingBudgets ? (
                <LoadingSpinner />
              ) : (
                <>
                  <h3 className="generic-card-title">Total</h3>
                  <div className="total-amount">{`$ ${budgetTotal}`}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
