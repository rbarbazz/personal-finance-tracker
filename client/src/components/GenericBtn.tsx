import React from 'react';

import '../styles/GenericBtn.scss';
import { LoadingSpinner } from './LoadingSpinner';

export const GenericBtn: React.FC<{
  action: Function;
  id?: string;
  isLoading?: boolean;
}> = ({ action, children, id, isLoading = false }) => (
  <button
    className="generic-btn"
    disabled={isLoading}
    id={id || ''}
    onClick={() => action()}
  >
    {isLoading ? <LoadingSpinner /> : children}
  </button>
);
