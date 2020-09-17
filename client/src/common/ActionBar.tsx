import React from 'react'

import './ActionBar.scss'

export const ActionBar: React.FC = ({ children }) => {
  return (
    <div className="action-bar">
      <div className="actions-container">{children}</div>
    </div>
  )
}
