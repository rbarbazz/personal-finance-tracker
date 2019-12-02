import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import '../styles/App.scss';
import { Analytics } from './Analytics';
import { LoadingBars } from '../components/LoadingBars';
import { Login } from './Login';
import { Operations } from './Operations';
import { requestUserStatus, receiveUserStatus } from '../store/actions/user';
import { State } from '../store/reducers/index';
import { SideMenu } from '../components/SideMenu';
import { Budget } from './Budget';
import { Profile } from './Profile';

const fetchUserStatus = () => {
  return async (dispatch: Function) => {
    dispatch(requestUserStatus());
    try {
      const res = await fetch('/login', {
        method: 'GET',
      });
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
        <LoadingBars />
      ) : (
        <Router>
          {isLoggedIn ? <SideMenu /> : null}
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <Redirect to="/analytics" /> : <Login />}
            </Route>
            <Route exact path="/analytics">
              {isLoggedIn ? <Analytics /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/budget">
              {isLoggedIn ? <Budget /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/profile">
              {isLoggedIn ? <Profile /> : <Redirect to="/" />}
            </Route>
            <Route exact path="/transactions">
              {isLoggedIn ? <Operations /> : <Redirect to="/" />}
            </Route>
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
