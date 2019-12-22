import { ResponsiveLine } from '@nivo/line';
import numeral from 'numeral';
import React from 'react';

import { colorsByCategory, chartTheme } from '../../containers/Analytics';
import { LineChartData } from '../../../../shared';

export const RetirementPlanChart: React.FC<{
  fireNumber: number;
  root: LineChartData;
}> = ({ fireNumber, root }) => (
  <ResponsiveLine
    axisBottom={{
      legend: 'Year',
      legendPosition: 'middle',
      legendOffset: 40,
      format: value => (+value % 2 ? value.toString() : ''),
    }}
    axisLeft={{
      legend: 'Portfolio Value',
      legendPosition: 'middle',
      legendOffset: -60,
      format: value => numeral(value).format('0a'),
    }}
    colors={[colorsByCategory['Income']]}
    data={root}
    enableArea
    margin={{ top: 5, right: 40, bottom: 45, left: 65 }}
    markers={[
      {
        axis: 'y',
        value: fireNumber,
        lineStyle: {
          stroke: colorsByCategory['Expenses'],
          strokeDasharray: 5,
          strokeWidth: 2,
        },
      },
    ]}
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
);
