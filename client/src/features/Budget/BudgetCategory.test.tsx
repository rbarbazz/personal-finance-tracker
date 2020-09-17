import '@testing-library/jest-dom/extend-expect'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { BudgetCategory } from './BudgetCategory'
import { renderWithRedux, mockStore } from '../../setupTests'
import * as budgetStore from './budgetStore'

const tbody = document.createElement('tbody')

test('Update a budget', () => {
  const mockUpdateBudgetAmount = jest.spyOn(budgetStore, 'updateBudgetAmount')
  const currentState = mockStore.getState()

  const { getByText, getByDisplayValue } = renderWithRedux(
    <BudgetCategory categoryId={2} title="Daily Life" initialValue={0} />,
    tbody,
  )

  fireEvent.click(getByText(/edit/i))
  fireEvent.change(getByDisplayValue(/0/i), { target: { value: 150 } })
  fireEvent.click(getByText(/save/i))

  expect(mockUpdateBudgetAmount).toHaveBeenCalledTimes(1)
  expect(mockUpdateBudgetAmount).toHaveBeenLastCalledWith(
    150,
    2,
    currentState.budgets.selectedMonth,
  )
})
