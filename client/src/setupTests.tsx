import { createMemoryHistory } from 'history'
import { createStore, applyMiddleware } from 'redux'
import { MemoryRouter, Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import React, { ReactElement } from 'react'
import thunk from 'redux-thunk'

import reducers from './app/rootReducer'

export const mockStore = createStore(reducers, applyMiddleware(thunk))
export const history = createMemoryHistory({ initialEntries: ['/'] })

export const renderWithRedux = (ui: ReactElement, container?: HTMLElement) => {
  const options = {
    ...(container ? { container: document.body.appendChild(container) } : {}),
  }

  return {
    ...render(
      <Provider store={mockStore}>
        <MemoryRouter>{ui}</MemoryRouter>
      </Provider>,
      options,
    ),
  }
}

export const renderWithRouter = (ui: ReactElement, container?: HTMLElement) => {
  const options = {
    ...(container ? { container: document.body.appendChild(container) } : {}),
  }
  const Wrapper: React.FC = ({ children }) => (
    <Router history={history}>{children}</Router>
  )

  return {
    ...render(
      <Provider store={mockStore}>
        <Wrapper>{ui}</Wrapper>
      </Provider>,
      options,
    ),
  }
}
