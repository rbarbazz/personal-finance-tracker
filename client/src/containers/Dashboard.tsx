import React from 'react';

import '../styles/Dashboard.scss';
import { SideMenu } from '../components/SideMenu';

export const Dashboard: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => (
  <div className="dashboard-container">
    <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
  </div>
);
