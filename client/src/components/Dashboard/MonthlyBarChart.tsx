import React from 'react';
import { ResponsiveBar } from '@nivo/bar';

export const MonthlyBarChart: React.FC<{ keys: string[]; data: object[] }> = ({
  keys,
  data,
}) => (
  <>
    <h3 className="chart-title">Expenses Monthly Repartition</h3>
    <div className="chart-container">
      <ResponsiveBar
        colors={{ scheme: 'nivo' }}
        indexBy="month"
        padding={0.3}
        labelSkipHeight={15}
        keys={keys}
        margin={{ top: 0, right: 20, bottom: 50, left: 60 }}
        data={data}
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
    </div>
  </>
);
