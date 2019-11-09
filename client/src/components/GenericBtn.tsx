import React from 'react';

import '../styles/GenericBtn.scss';

export const GenericBtn: React.FC<{
  action: Function;
  id?: string;
  value: string;
}> = ({ action, id, value }) => (
  <button className="generic-btn" id={id || ''} onClick={() => action()}>
    {value}
  </button>
);
