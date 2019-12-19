import React from 'react';

import '../styles/Analytics.scss';
import { ActionBar } from '../components/ActionBar';
import { SectionHeader } from '../components/SectionHeader';

export const Fire: React.FC = () => {
  return (
    <div className="page-container">
      <ActionBar></ActionBar>
      <div className="content-container">
        <SectionHeader
          subtitle="Calculate your FIRE number and plan your way to early retirement."
          title="FIRE Calculators"
        />
        <div className="inner-content-container">
          <div className="generic-card">
            <h3 className="generic-card-title">FIRE Number Calculator</h3>
          </div>
        </div>
      </div>
    </div>
  );
};
