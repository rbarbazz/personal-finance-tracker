import { ResponsiveBar } from '@nivo/bar';
import React from 'react';

import { LoadingBars } from '../LoadingBars';
import { MonthlyBarChartRoot } from '../../store/reducers/analytics';

export const MonthlyBarChart: React.FC<{
  root: MonthlyBarChartRoot;
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
                  legendOffset: 40,
                }}
                axisLeft={{
                  legend: 'Expense',
                  legendPosition: 'middle',
                  legendOffset: -55,
                }}
                colors={[
                  '#790035',
                  '#931537',
                  '#ac2a37',
                  '#c34034',
                  '#d8572f',
                  '#e87026',
                  '#f68a19',
                  '#ffa600',
                ]}
                data={data}
                indexBy="month"
                keys={keys}
                labelSkipHeight={15}
                margin={{ top: 0, right: 20, bottom: 50, left: 60 }}
                padding={0.3}
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fill: 'black',
                        fontFamily: '"Nunito", sans-serif',
                        fontSize: 14,
                      },
                    },
                    legend: {
                      text: {
                        fontFamily: '"Nunito", sans-serif',
                        fontSize: 14,
                        fontWeight: 600,
                      },
                    },
                  },
                  labels: {
                    text: {
                      fill: 'red',
                      fontFamily: '"Nunito", sans-serif',
                      fontSize: 14,
                    },
                  },
                  tooltip: { container: { color: 'black' } },
                }}
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
