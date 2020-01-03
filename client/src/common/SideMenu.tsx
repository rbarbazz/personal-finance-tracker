import { Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

import './SideMenu.scss';
import { logout } from '../features/Profile/user';
import { ReactComponent as CalculatorIcon } from '../icons/Calculator.svg';
import { ReactComponent as BurgerIcon } from '../icons/Burger.svg';
import { ReactComponent as ChartIcon } from '../icons/Chart.svg';
import { ReactComponent as FireIcon } from '../icons/Fire.svg';
import { ReactComponent as LogoutIcon } from '../icons/Logout.svg';
import { ReactComponent as PersonIcon } from '../icons/Person.svg';
import { ReactComponent as PriceTagIcon } from '../icons/PriceTag.svg';

export const SideMenu: React.FC = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const [isOpen, toggleMenu] = useState(false);

  return (
    <>
      <button
        className="side-menu-item brand-logo"
        onClick={() => toggleMenu(prev => !prev)}
      >
        <BurgerIcon />
      </button>
      <div
        className="side-menu-container"
        {...(!isOpen ? { style: { width: 0 } } : {})}
      >
        <div className="side-menu-items">
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
    </>
  );
};
