import React, { useState, useEffect } from 'react';
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

const App: React.FC = () => {
  const initialIsLoggedIn = async () => {
    try {
      const res = await fetch('/login', {
        method: 'GET',
      });
      toggleIsLoading(false);
      if (res.status === 200) {
        const {
          userLoginStatus,
        }: { userLoginStatus: boolean } = await res.json();

        toggleIsLoggedIn(userLoginStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [isLoggedIn, toggleIsLoggedIn] = useState(false);
  const [isLoading, toggleIsLoading] = useState(true);

  useEffect(() => {
    initialIsLoggedIn();
  }, []);

  return (
    <div className="app">
      {isLoading ? (
        <LoadingBars />
      ) : (
        <Router>
          <Switch>
            <Route exact path="/">
              {isLoggedIn ? (
                <Redirect to="/analytics" />
              ) : (
                <Login toggleIsLoggedIn={toggleIsLoggedIn} />
              )}
            </Route>
            <Route exact path="/analytics">
              {isLoggedIn ? (
                <Analytics toggleIsLoggedIn={toggleIsLoggedIn} />
              ) : (
                <Redirect to="/" />
              )}
            </Route>
            <Route exact path="/transactions">
              {isLoggedIn ? (
                <Operations toggleIsLoggedIn={toggleIsLoggedIn} />
              ) : (
                <Redirect to="/" />
              )}
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
