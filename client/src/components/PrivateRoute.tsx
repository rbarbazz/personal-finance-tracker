import { Route, Redirect } from 'react-router-dom';
import React from 'react';

export const PrivateRoute: React.FC<{
  isLoggedIn: boolean;
  path: string;
}> = ({ children, isLoggedIn, path }) => {
  return (
    <Route exact path={path}>
      {isLoggedIn ? children : <Redirect to="/" />}
    </Route>
  );
};
