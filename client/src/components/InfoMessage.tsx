import React from 'react';

import '../styles/InfoMessage.scss';

export const InfoMessage: React.FC<{ value: string; error: boolean }> = ({
  value,
  error,
}) => <p className={`message-container${!error ? ' success' : ''}`}>{value}</p>;
