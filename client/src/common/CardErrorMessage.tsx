import React from 'react'

import './CardErrorMessage.scss'
import { ReactComponent as AlertIcon } from '../icons/Alert.svg'

export const CardErrorMessage: React.FC<{
  isMobileError?: boolean
  message: string
}> = ({ isMobileError = false, message }) => (
  <div
    className={`chart-error-container${isMobileError ? ' mobile-error' : ''}`}
  >
    <AlertIcon />
    <p className="chart-error-message">{message}</p>
  </div>
)
