import { LineDatum } from '@nivo/line';
import React from 'react';

import { BudgetLineChartData } from './BudgetLineChart';

const average = (array: LineDatum[]) =>
  (
    Array.from(array, elem => {
      if (elem.y) return +elem.y;
      else return 0;
    }).reduce((a, b) => a + b) / array.length
  ).toFixed(2);

export const Averages: React.FC<{
  budgetLineChart: BudgetLineChartData;
}> = ({ budgetLineChart }) => {
  const averages = [];

  if (budgetLineChart[3] && budgetLineChart[3].data)
    averages.push({
      amount: average(budgetLineChart[3].data),
      title: String(budgetLineChart[3].id),
    });
  if (budgetLineChart[2] && budgetLineChart[2].data)
    averages.push({
      amount: average(budgetLineChart[2].data),
      title: String(budgetLineChart[2].id),
    });
  if (budgetLineChart[1] && budgetLineChart[1].data)
    averages.push({
      amount: average(budgetLineChart[1].data),
      title: String(budgetLineChart[1].id),
    });

  return (
    <div className="text-card-containter">
      {averages.map(average => (
        <div key={average.title} className="text-card-item generic-card">
          <div className="text-card-amount">{`$ ${average.amount}`}</div>
          <h3 className="text-card-title">{`Monthly Averages ${average.title}`}</h3>
        </div>
      ))}
    </div>
  );
};
