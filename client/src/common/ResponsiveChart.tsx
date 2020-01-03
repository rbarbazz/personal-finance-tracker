import React from 'react';

import './ResponsiveChart.scss';

export const ResponsiveChart: React.FC = ({ children }) => (
  <div className="chart-container">
    <div className="chart-responsive-container">{children}</div>
  </div>
);
