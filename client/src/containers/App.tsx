import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import '../styles/App.scss';
import { Login } from './Login';

const App: React.FC = () => {
  const [isLoggedIn, toggleIsLoggedIn] = useState(false);

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
