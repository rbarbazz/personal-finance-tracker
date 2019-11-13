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
      {['dashboard', 'operations'].map((item) => (
        <Link
          className={`side-menu-item${
            pathname === `/${item}` ? ' selected' : ''
          }`}
          key={`side-menu-item-${item}`}
          to={`/${item}`}
        >
          {item}
          <div className="arrow-left"></div>
        </Link>
      ))}
      <button className="side-menu-item" onClick={logout}>
        Log Out
      </button>
    </div>
  );
};
