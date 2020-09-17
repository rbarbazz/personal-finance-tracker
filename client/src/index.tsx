import 'normalize.css'
import { createLogger } from 'redux-logger'
import { createStore, applyMiddleware, Middleware } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import ReactDOM from 'react-dom'
import thunk from 'redux-thunk'

import App from './app/App'
import reducers from './app/rootReducer'

let middlewares: Middleware[] = [thunk]

if (process.env.NODE_ENV === 'development') middlewares.push(createLogger())

const store = createStore(reducers, applyMiddleware(...middlewares))

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
