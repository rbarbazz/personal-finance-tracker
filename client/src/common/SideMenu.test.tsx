import '@testing-library/jest-dom/extend-expect'
import { fireEvent } from '@testing-library/react'
import React from 'react'

import { SideMenu } from './SideMenu'
import { history, renderWithRedux, renderWithRouter } from '../setupTests'
import * as userStore from '../features/Profile/user'

test('Logs out on click', () => {
  const mockLogout = jest.spyOn(userStore, 'logout')

  const { getByText } = renderWithRedux(<SideMenu />)

  fireEvent.click(getByText(/logout\.svg/i))

  expect(mockLogout).toHaveBeenCalledTimes(1)
})

test('Changes page when click on a link', () => {
  const { getByText } = renderWithRouter(<SideMenu />)

  fireEvent.click(getByText(/chart\.svg/i))

  expect(history.location.pathname).toBe('/analytics')

  fireEvent.click(getByText(/calculator\.svg/i))

  expect(history.location.pathname).toBe('/budget')
})
