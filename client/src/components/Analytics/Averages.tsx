import React from 'react';

import { LoadingBars } from '../LoadingBars';

export const Averages: React.FC<{
  averages: { amount: string; title: string }[];
  isLoading: boolean;
}> = ({ averages, isLoading }) => (
  <div className="text-card-containter">
    {averages.map(average => (
      <div key={average.title} className="text-card-item generic-card">
        {isLoading ? (
          <LoadingBars />
        ) : (
          <>
            <div className="text-card-amount">{`$ ${average.amount}`}</div>
            <h3 className="text-card-title">{`Monthly Averages ${average.title}`}</h3>
          </>
        )}
      </div>
    ))}
  </div>
);
