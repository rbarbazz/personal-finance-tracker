import React from 'react';

export type ListAverages = { amount: string; title: string }[];

export const Averages: React.FC<{
  averages: ListAverages;
}> = ({ averages }) => {
  return (
    <div className="text-card">
      <h3 className="chart-title">Monthly Averages</h3>
      <div className="text-card-items-wrapper">
        {averages.map(average => (
          <div key={average.title} className="text-card-item">
            <div className="text-card-amount">{`$ ${average.amount}`}</div>
            <h3 className="text-card-title">{average.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};
