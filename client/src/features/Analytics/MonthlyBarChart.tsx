import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

import { BarChartData } from '../../../../shared';
import { CardErrorMessage } from '../../common/CardErrorMessage';
import { chartTheme, colorsByCategory } from './Analytics';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { ResponsiveChart } from '../../common/ResponsiveChart';

export const MonthlyBarChart: React.FC<{
  root: BarChartData;
  isLoading: boolean;
}> = ({ root, isLoading }) => {
  const { data, keys } = root;

  return (
    <div className="chart-wrapper generic-card" id="monthlybarchart">
      <h3 className="generic-card-title">Expenses Monthly Repartition</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveChart>
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
              colors={bar => colorsByCategory[bar.id]}
              data={data}
              indexBy="month"
              keys={keys}
              label={d => `$ ${d.value}`}
              labelSkipHeight={15}
              labelTextColor="white"
              margin={{ top: 10, right: 0, bottom: 50, left: 60 }}
              padding={0.3}
              theme={chartTheme}
            />
          ) : (
            <CardErrorMessage message="Please import more transactions before you can see this chart" />
          )}
        </ResponsiveChart>
      )}
    </div>
  );
};
