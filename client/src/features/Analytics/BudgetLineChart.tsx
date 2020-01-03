import { ResponsiveLine } from '@nivo/line';
import React from 'react';

import { CardErrorMessage } from '../../common/CardErrorMessage';
import { chartTheme, colorsByCategory } from './Analytics';
import { LineChartData } from '../../../../shared';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ResponsiveChart } from '../../common/ResponsiveChart';

export const BudgetLineChart: React.FC<{
  isLoading: boolean;
  root: LineChartData;
}> = ({ isLoading, root }) => {
  const isNotEmpty = !!root.find(line => line.data.length > 0);

  return (
    <div className="chart-wrapper generic-card" id="budgetlinechart">
      <h3 className="generic-card-title">Budget Monthly Trend</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ResponsiveChart>
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
          </ResponsiveChart>
          <CardErrorMessage
            isMobileError
            message="Charts are only available in landscape mode on mobile. If you are on landscape mode then your phone is too small sorry."
          />
        </>
      )}
    </div>
  );
};
