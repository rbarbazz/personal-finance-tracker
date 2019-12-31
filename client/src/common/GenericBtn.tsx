import React from 'react';

import './GenericBtn.scss';
import { LoadingSpinner } from './LoadingSpinner';

export const GenericBtn: React.FC<{
  action?: Function;
  id?: string;
  isLoading?: boolean;
  type?: 'button' | 'submit' | 'reset' | undefined;
}> = ({ action, children, id, isLoading = false, type = 'button' }) => (
  <button
    className="generic-btn"
    disabled={isLoading}
    id={id || ''}
    {...(action ? { onClick: () => action() } : {})}
    type={type}
  >
    {isLoading ? <LoadingSpinner /> : children}
  </button>
);
