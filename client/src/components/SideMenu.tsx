import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React from 'react';

import '../styles/SideMenu.scss';
import { ReactComponent as CalculatorIcon } from '../icons/Calculator.svg';
import { ReactComponent as ChartIcon } from '../icons/Chart.svg';
import { ReactComponent as FireIcon } from '../icons/Fire.svg';
import { ReactComponent as HouseOutlineIcon } from '../icons/HouseOutline.svg';
import { ReactComponent as LogoutIcon } from '../icons/Logout.svg';
import { ReactComponent as PersonIcon } from '../icons/Person.svg';
import { ReactComponent as PriceTagIcon } from '../icons/PriceTag.svg';
import { userLoggedOut } from '../store/actions/user';

export const logout = () => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/auth/logout', {
        method: 'GET',
      });
      if (res.status === 200) {
        dispatch(userLoggedOut());
      }
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
};

export const SideMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  return (
    <div className="side-menu-container">
      <div className="side-menu-items">
        <Link className="side-menu-item brand-logo" to="/">
          <HouseOutlineIcon />
        </Link>
        {[
          { title: 'analytics', icon: <ChartIcon /> },
          { title: 'budget', icon: <CalculatorIcon /> },
          { title: 'transactions', icon: <PriceTagIcon /> },
          { title: 'calculators', icon: <FireIcon /> },
          { title: 'profile', icon: <PersonIcon /> },
        ].map(item => (
          <Link
            className={`side-menu-item${
              pathname === `/${item.title}` ? ' selected' : ''
            }`}
            key={`side-menu-item-${item.title}`}
            to={`/${item.title}`}
          >
            {item.icon}
            <div className="arrow-left"></div>
          </Link>
        ))}
        <div className="side-menu-item" onClick={() => dispatch(logout())}>
          <LogoutIcon />
        </div>
      </div>
    </div>
  );
};
