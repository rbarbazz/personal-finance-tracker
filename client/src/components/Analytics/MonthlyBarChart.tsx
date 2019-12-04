import { Data, BarProps, ResponsiveBar } from '@nivo/bar';
import React from 'react';

import { chartTheme, chartColorPalette } from '../../containers/Analytics';
import { LoadingBars } from '../LoadingBars';

export type MonthlyBarChartData = {
  data: Data['data'];
  keys: BarProps['keys'];
};

export const MonthlyBarChart: React.FC<{
  root: MonthlyBarChartData;
  isLoading: boolean;
}> = ({ root, isLoading }) => {
  const { data, keys } = root;
  return (
    <div className="chart-wrapper" id="monthlybarchart">
      {isLoading ? (
        <LoadingBars />
      ) : (
        <>
          <h3 className="chart-title">Expenses Monthly Repartition</h3>
          <div className="chart-container">
            {data && data.length > 0 ? (
              <ResponsiveBar
                axisBottom={{
                  legend: 'Month',
                  legendPosition: 'middle',
                  legendOffset: 45,
                }}
                axisLeft={{
                  legend: 'Expenses',
                  legendPosition: 'middle',
                  legendOffset: -55,
                }}
                colors={chartColorPalette}
                data={data}
                indexBy="month"
                keys={keys}
                labelSkipHeight={15}
                labelTextColor="white"
                margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
                padding={0.3}
                theme={chartTheme}
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
};
