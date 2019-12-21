import { ResponsiveLine } from '@nivo/line';
import React from 'react';

import { BudgetLineChartData } from '../Analytics/BudgetLineChart';
import { colorsByCategory, chartTheme } from '../../containers/Analytics';

export const RetirementPlanChart: React.FC<{
  root: BudgetLineChartData;
}> = ({ root }) => (
  <ResponsiveLine
    axisBottom={{
      legend: 'Year',
      legendPosition: 'middle',
      legendOffset: 40,
    }}
    axisLeft={{
      legend: 'Portfolio Value',
      legendPosition: 'middle',
      legendOffset: -55,
    }}
    colors={[colorsByCategory['Income']]}
    data={root}
    enableArea
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
);
