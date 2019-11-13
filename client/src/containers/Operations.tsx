import React from 'react';

import '../styles/Operations.scss';
import { SideMenu } from '../components/SideMenu';

export const Operations: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => (
  <div className="main-container">
    <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
    <div className="operations-container"></div>
  </div>
);
