import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import '../styles/App.scss';
import { Login } from './Login';

const App: React.FC = () => {
  const getPreviousSession = async () => {
    try {
      const res = await fetch('/login',{
        method: 'POST',
      });
      if (res.status === 200) {
        toggleIsLoggedIn(true);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [isLoggedIn, toggleIsLoggedIn] = useState(false);
  useEffect(() => {
    getPreviousSession();
  }, []);

  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/">
            {isLoggedIn ? 'Logged in!' : <Login toggleIsLoggedIn={toggleIsLoggedIn} />}
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
