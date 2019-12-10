import { ResponsivePie } from '@nivo/pie';
import React from 'react';

import { BudgetCategoryType } from '../../../../server/src/routes/budgets';
import { CardErrorMessage } from '../CardErrorMessage';
import { chartTheme, colorsByCategory } from '../../containers/Analytics';
import { LoadingSpinner } from '../LoadingSpinner';

export const BudgetPieChart: React.FC<{
  isLoading: boolean;
  root: BudgetCategoryType[];
  total: number;
}> = ({ isLoading, root, total }) => {
  const data = root
    .filter(budget => budget.amount > 0)
    .map(budget => {
      const { amount, title } = budget;

      return {
        id: title,
        label: title,
        value: amount,
      };
    });

  return (
    <div className="budget-pie-chart-container generic-card">
      {isLoading ? (
        <LoadingSpinner />
      ) : total > 0 ? (
        <ResponsivePie
          colors={pie => colorsByCategory[pie.id]}
          cornerRadius={3}
          data={data}
          enableRadialLabels={false}
          innerRadius={0.5}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          padAngle={1}
          sliceLabel="id"
          slicesLabelsTextColor="white"
          theme={chartTheme}
        />
      ) : (
        <CardErrorMessage message="Please update your monthly budget before you can see this chart" />
      )}
    </div>
  );
};
