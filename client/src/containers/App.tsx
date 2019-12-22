import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/App.scss';
import { Analytics } from './Analytics';
import { Budget } from './Budget';
import { Fire } from './Fire';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Login } from './Login';
import { Operations } from './Operations';
import { PrivateRoute } from '../components/PrivateRoute';
import { Profile } from './Profile';
import { requestUserStatus, receiveUserStatus } from '../store/actions/user';
import { SideMenu } from '../components/SideMenu';
import { State } from '../store/reducers/index';

export const fetchUserStatus = () => {
  return async (dispatch: Function) => {
    dispatch(requestUserStatus());
    try {
      const res = await fetch('/api/auth/login', { method: 'GET' });
      if (res.status === 200) {
        const {
          isLoggedIn,
          fName,
        }: { isLoggedIn: boolean; fName: string } = await res.json();

        dispatch(receiveUserStatus(isLoggedIn, fName));
      } else dispatch(receiveUserStatus(false, ''));
    } catch (error) {
      console.error(error);
    }
  };
};

const App: React.FC = () => {
  const dispatch = useDispatch();
  const getInitialUserStatus = useCallback(() => {
    dispatch(fetchUserStatus());
  }, [dispatch]);
  const isFetchingStatus = useSelector(
    (state: State) => state.user.isFetchingStatus,
  );
  const isLoggedIn = useSelector((state: State) => state.user.isLoggedIn);

  useEffect(() => {
    getInitialUserStatus();
  }, [getInitialUserStatus]);

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
  );
};

export default App;
