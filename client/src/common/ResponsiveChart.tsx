import React from 'react'

import './ResponsiveChart.scss'
import { CardErrorMessage } from './CardErrorMessage'

export const ResponsiveChart: React.FC = ({ children }) => (
  <div className="chart-container">
    <div className="chart-responsive-container">{children}</div>
    <CardErrorMessage
      isMobileError
      message="Charts are only available in landscape mode on mobile. If you are on landscape mode then your phone is too small sorry."
    />
  </div>
)
