import '@testing-library/jest-dom/extend-expect'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { Operation } from '../../../../server/src/db/models'
import { OperationTableRow } from './OperationsTableRow'
import { renderWithRedux } from '../../setupTests'
import * as operationsStore from './operationsStore'

const tbody = document.createElement('tbody')

const mockOperation: Operation = {
  amount: -1,
  categoryId: 1,
  categoryTitle: 'Uncategorized',
  id: 216,
  label: 'test',
  operationDate: '2020-01-03T00:00:00.000Z',
  parentCategoryId: 1,
  userId: 1,
}

test('Delete an operation', () => {
  const mockDelOperation = jest.spyOn(operationsStore, 'delOperation')

  const { getByText } = renderWithRedux(
    <OperationTableRow operation={mockOperation} />,
    tbody,
  )

  fireEvent.click(getByText(/delete/i))

  expect(mockDelOperation).toHaveBeenCalledTimes(1)
  expect(mockDelOperation).toHaveBeenLastCalledWith(216)
})
