import React from 'react';

import '../styles/GenericBtn.scss';
import { LoadingBars } from './LoadingBars';

export const GenericBtn: React.FC<{
  action: Function;
  id?: string;
  isLoading?: boolean;
  value: string;
}> = ({ action, id, value, isLoading = false }) =>
  !isLoading ? (
    <button className="generic-btn" id={id || ''} onClick={() => action()}>
      {value}
    </button>
  ) : (
    <LoadingBars />
  );
