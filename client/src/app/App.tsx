import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import React, { useEffect, useCallback } from 'react'

import './App.scss'
import { Analytics } from '../features/Analytics/Analytics'
import { Budget } from '../features/Budget/Budget'
import { Fire } from '../features/Fire/Fire'
import { LoadingSpinner } from '../common/LoadingSpinner'
import { Login } from '../features/Login/Login'
import { Operations } from '../features/Operations/Operations'
import { PrivateRoute } from '../common/PrivateRoute'
import { Profile } from '../features/Profile/Profile'
import { requestUserStatus, receiveUserStatus } from '../features/Profile/user'
import { SideMenu } from '../common/SideMenu'
import { State } from './rootReducer'
import { LostPassword } from '../features/Login/LostPassword'

export const fetchUserStatus = () => {
  return async (dispatch: Function) => {
    dispatch(requestUserStatus())
    try {
      const res = await fetch('/api/auth/login', { method: 'GET' })
      if (res.status === 200) {
        const {
          isLoggedIn,
          fName,
        }: { isLoggedIn: boolean; fName: string } = await res.json()

        dispatch(receiveUserStatus(isLoggedIn, fName))
      } else dispatch(receiveUserStatus(false, ''))
    } catch (error) {
      console.error(error)
    }
  }
}

const App: React.FC = () => {
  const dispatch = useDispatch()
  const getInitialUserStatus = useCallback(() => {
    dispatch(fetchUserStatus())
  }, [dispatch])
  const isFetchingStatus = useSelector(
    (state: State) => state.user.isFetchingStatus,
  )
  const isLoggedIn = useSelector((state: State) => state.user.isLoggedIn)

  useEffect(() => {
    getInitialUserStatus()
  }, [getInitialUserStatus])

  return (
    <>
      {isFetchingStatus ? (
        <LoadingSpinner />
      ) : (
        <Router>
          {isLoggedIn ? <SideMenu /> : null}
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <Redirect to="/analytics" /> : <Login />}
            </Route>
            <Route exact path="/lost-password">
              <LostPassword />
            </Route>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/analytics">
              <Analytics />
            </PrivateRoute>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/budget">
              <Budget />
            </PrivateRoute>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/transactions">
              <Operations />
            </PrivateRoute>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/calculators">
              <Fire />
            </PrivateRoute>
            <PrivateRoute isLoggedIn={isLoggedIn} path="/profile">
              <Profile />
            </PrivateRoute>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      )}
    </>
  )
}

export default App
