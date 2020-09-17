import '@testing-library/jest-dom/extend-expect'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { Analytics } from './Analytics'
import { renderWithRedux } from '../../setupTests'
import * as analyticsStore from './analyticsStore'

test('Refresh the charts', () => {
  const mockFetchMonthlyBar = jest.spyOn(analyticsStore, 'fetchMonthlyBar')
  const mockFetchBudgetLine = jest.spyOn(analyticsStore, 'fetchBudgetLine')
  const mockFetchTreeMap = jest.spyOn(analyticsStore, 'fetchTreeMap')

  const { getByText } = renderWithRedux(<Analytics />)

  fireEvent.click(getByText(/refresh/i))

  expect(mockFetchMonthlyBar).toHaveBeenCalledTimes(1)
  expect(mockFetchBudgetLine).toHaveBeenCalledTimes(1)
  expect(mockFetchTreeMap).toHaveBeenCalledTimes(1)
})
