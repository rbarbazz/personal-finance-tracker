import React from 'react';

import '../styles/CardErrorMessage.scss';
import { ReactComponent as AlertIcon } from '../icons/Alert.svg';

export const CardErrorMessage: React.FC<{
  message: string;
}> = ({ message }) => (
  <div className="chart-error-container">
    <AlertIcon />
    <p className="chart-error-message">{message}</p>
  </div>
);
