import React from 'react';

import '../styles/GenericBtn.scss';
import { LoadingSpinner } from './LoadingSpinner';

export const GenericBtn: React.FC<{
  action: Function;
  id?: string;
  isLoading?: boolean;
  value: React.ReactChild[] | string;
}> = ({ action, id, value, isLoading = false }) => (
  <button
    className="generic-btn"
    disabled={isLoading}
    id={id || ''}
    onClick={() => action()}
  >
    {isLoading ? <LoadingSpinner /> : value}
  </button>
);
