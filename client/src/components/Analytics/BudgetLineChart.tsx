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
                legendOffset: 45,
              }}
              axisLeft={{
                legend: 'Amount',
                legendPosition: 'middle',
                legendOffset: -55,
              }}
              data={root}
              colors={['#007944']}
              legends={[
                {
                  anchor: 'top-right',
                  direction: 'column',
                  itemWidth: 80,
                  itemHeight: 20,
                  symbolShape: 'circle',
                  translateY: -30,
                },
              ]}
              margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
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
