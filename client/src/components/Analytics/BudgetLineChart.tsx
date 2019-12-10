import { ResponsiveLine } from '@nivo/line';
import React from 'react';

import { CardErrorMessage } from '../CardErrorMessage';
import { chartTheme, colorsByCategory } from '../../containers/Analytics';
import { LoadingSpinner } from '../LoadingSpinner';

export type BudgetLineChartData = {
  id: string;
  data: { x: string; y: number }[];
}[];

export const BudgetLineChart: React.FC<{
  isLoading: boolean;
  root: BudgetLineChartData;
}> = ({ isLoading, root }) => {
  const isNotEmpty = !!root.find(line => line.data.length > 0);

  return (
    <div className="chart-wrapper generic-card" id="budgetlinechart">
      <h3 className="chart-title">Budget Monthly Trend</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="chart-container">
          {isNotEmpty ? (
            <ResponsiveLine
              axisBottom={{
                legend: 'Month',
                legendPosition: 'middle',
                legendOffset: 40,
              }}
              axisLeft={{
                legend: 'Amount',
                legendPosition: 'middle',
                legendOffset: -55,
              }}
              colors={[
                colorsByCategory['Budget'],
                colorsByCategory['Savings'],
                colorsByCategory['Expenses'],
                colorsByCategory['Income'],
              ]}
              data={root}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  itemHeight: 20,
                  itemsSpacing: 20,
                  itemWidth: 80,
                  symbolShape: 'circle',
                  translateY: 70,
                },
              ]}
              margin={{ top: 5, right: 40, bottom: 70, left: 60 }}
              pointBorderColor={{ from: 'serieColor' }}
              pointBorderWidth={2}
              pointColor="white"
              pointLabel="y"
              pointLabelYOffset={-10}
              pointSize={8}
              theme={chartTheme}
              useMesh
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
              }}
            />
          ) : (
            <CardErrorMessage message="Please import more transactions before you can see this chart" />
          )}
        </div>
      )}
    </div>
  );
};
