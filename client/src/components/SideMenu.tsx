import React from 'react';
import { Link, useLocation } from 'react-router-dom';

import '../styles/SideMenu.scss';

export const SideMenu: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const { pathname } = useLocation();
  const logout = async () => {
    try {
      const res = await fetch('/logout', {
        method: 'GET',
      });
      if (res.status === 200) {
        toggleIsLoggedIn(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="side-menu-container">
      <Link
        className={`side-menu-item${
          pathname === '/dashboard' ? ' selected' : ''
        }`}
        to="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className={`side-menu-item${
          pathname === '/operations' ? ' selected' : ''
        }`}
        to="/operations"
      >
        Operations
      </Link>
      <button className="side-menu-item" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};
