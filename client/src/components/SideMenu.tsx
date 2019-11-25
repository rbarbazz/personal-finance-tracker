import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';

import '../styles/SideMenu.scss';
import { ReactComponent as Chart } from '../icons/Chart.svg';
import { ReactComponent as Logout } from '../icons/Logout.svg';
import { ReactComponent as PriceTag } from '../icons/PriceTag.svg';
import { userLoggedOut } from '../store/actions/user';

export const SideMenu: React.FC = () => {
  const dispatch = useDispatch();

  const { pathname } = useLocation();
  const logout = async () => {
    try {
      const res = await fetch('/logout', {
        method: 'GET',
      });
      if (res.status === 200) {
        dispatch(userLoggedOut());
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="side-menu-container">
      {[
        { title: 'analytics', icon: <Chart /> },
        { title: 'transactions', icon: <PriceTag /> },
      ].map(item => (
        <Link
          className={`side-menu-item${
            pathname === `/${item.title}` ? ' selected' : ''
          }`}
          key={`side-menu-item-${item.title}`}
          to={`/${item.title}`}
        >
          {item.icon}
          {item.title}
          <div className="arrow-left"></div>
        </Link>
      ))}
      <button className="side-menu-item" onClick={logout}>
        <Logout />
        {'Log Out'}
      </button>
    </div>
  );
};
