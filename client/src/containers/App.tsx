import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
} from 'react-router-dom';

import '../styles/App.scss';
import { Login } from './Login';
import { LoadingBars } from '../components/LoadingBars';
import { Dashboard } from './Dashboard';
import { SideMenu } from '../components/SideMenu';

const App: React.FC = () => {
  const initialIsLoggedIn = async () => {
    toggleIsLoading(true);
    try {
      const res = await fetch('/login', {
        method: 'GET',
      });
      toggleIsLoading(false);
      if (res.status === 200) {
        const { userLoginStatus } = await res.json();

        toggleIsLoggedIn(userLoginStatus);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [isLoggedIn, toggleIsLoggedIn] = useState(false);
  const [isLoading, toggleIsLoading] = useState(false);

  useEffect(() => {
    initialIsLoggedIn();
  }, []);

  return (
    <div className="app">
      {isLoading ? (
        <LoadingBars />
      ) : (
        <div className="main-container">
          <Router>
            {isLoggedIn && <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />}
            <Switch>
              <Route exact path="/">
                {isLoggedIn ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Login toggleIsLoggedIn={toggleIsLoggedIn} />
                )}
              </Route>
              <Route exact path="/dashboard">
                {isLoggedIn ? <Dashboard /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/operations">
                {isLoggedIn ? <LoadingBars /> : <Redirect to="/" />}
              </Route>
              <Route path="*">
                <Redirect to="/" />
              </Route>
            </Switch>
          </Router>
        </div>
      )}
    </div>
  );
};

export default App;
