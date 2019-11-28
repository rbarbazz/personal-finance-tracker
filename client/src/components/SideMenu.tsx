import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';

import '../styles/SideMenu.scss';
import { ReactComponent as Chart } from '../icons/Chart.svg';
import { ReactComponent as Logout } from '../icons/Logout.svg';
import { ReactComponent as PriceTag } from '../icons/PriceTag.svg';
import { userLoggedOut } from '../store/actions/user';

const logout = async (dispatch: Function) => {
  try {
    const res = await fetch('/logout', {
      method: 'GET',
    });
    if (res.status === 200) {
      dispatch(userLoggedOut());
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

export const SideMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <div className="side-menu-container">
      <div className="side-menu-items">
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
            <span>{item.title}</span>
            <div className="arrow-left"></div>
          </Link>
        ))}
        <div className="side-menu-item" onClick={() => logout(dispatch)}>
          <Logout />
          <span>Log Out</span>
        </div>
      </div>
    </div>
  );
};
