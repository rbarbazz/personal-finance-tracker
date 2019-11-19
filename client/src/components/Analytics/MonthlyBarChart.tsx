import { ResponsiveBar } from '@nivo/bar';
import React from 'react';
import { LoadingBars } from '../LoadingBars';

export const MonthlyBarChart: React.FC<{
  keys: string[];
  data: object[];
  isLoading: boolean;
}> = ({ keys, data, isLoading }) => (
  <div className="chart-wrapper">
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
              colors={['#790035', '#a62537', '#ce4b32', '#ec7623', '#ffa600']}
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
