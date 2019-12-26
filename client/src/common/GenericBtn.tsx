import React from 'react';

import './GenericBtn.scss';
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
    type="button"
  >
    {isLoading ? <LoadingSpinner /> : children}
  </button>
);
