import React from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

export const Averages: React.FC<{
  averages: { amount: string; title: string }[];
  isLoading: boolean;
}> = ({ averages, isLoading }) => (
  <div className="text-card-containter">
    {averages.map(average => (
      <div key={average.title} className="text-card-item generic-card">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="text-card-amount">{`$ ${average.amount}`}</div>
            <h3 className="text-card-title">{`Monthly Average ${average.title}`}</h3>
            <p className="text-card-subtitle">Last three months</p>
          </>
        )}
      </div>
    ))}
  </div>
);
