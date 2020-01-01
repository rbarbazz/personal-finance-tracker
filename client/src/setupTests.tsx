import { createStore, applyMiddleware } from 'redux';
import { MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import React, { ReactElement } from 'react';
import thunk from 'redux-thunk';

import reducers from './app/rootReducer';

export const mockStore = createStore(reducers, applyMiddleware(thunk));

export const renderWithRedux = (ui: ReactElement, container?: HTMLElement) => {
  const options = {
    ...(container ? { container: document.body.appendChild(container) } : {}),
    wrapper: MemoryRouter,
  };

  return { ...render(<Provider store={mockStore}>{ui}</Provider>, options) };
};
