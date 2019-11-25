import React, { useEffect } from 'react';
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

const App: React.FC = () => {
  const dispatch = useDispatch();
  const isFetchingStatus = useSelector(
    (state: State) => state.user.isFetchingStatus,
  );
  const isLoggedIn = useSelector((state: State) => state.user.isLoggedIn);

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
        dispatch(receiveUserStatus(false, ''));
        console.error(error);
      }
    };
  };

  useEffect(() => {
    dispatch(fetchUserStatus());
  }, [dispatch]);

  return (
    <div className="app">
      {isFetchingStatus ? (
        <LoadingBars />
      ) : (
        <Router>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? <Redirect to="/analytics" /> : <Login />}
            </Route>
            <Route exact path="/analytics">
              {isLoggedIn ? <Analytics /> : <Redirect to="/" />}
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
    </div>
  );
};

export default App;
