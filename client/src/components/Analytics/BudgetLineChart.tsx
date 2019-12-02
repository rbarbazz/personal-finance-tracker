import { ResponsiveLine } from '@nivo/line';
import React from 'react';

import { BudgetLineChartNode } from '../../../../server/src/routes/charts';
import { chartTheme } from '../../containers/Analytics';
import { LoadingBars } from '../LoadingBars';

export const BudgetLineChart: React.FC<{
  isLoading: boolean;
  root: BudgetLineChartNode[];
}> = ({ isLoading, root }) => (
  <div className="chart-wrapper" id="budgetlinechart">
    {isLoading ? (
      <LoadingBars />
    ) : (
      <>
        <h3 className="chart-title">Budget Monthly Trend</h3>
        <div className="chart-container">
          {root.length > 0 ? (
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
              colors={['#ffa600', '#790800', '#007944']}
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
            />
          ) : (
            <p className="chart-error-message">
              Please import more transactions to see this chart...
            </p>
          )}
        </div>
      </>
    )}
  </div>
);
