import { ResponsiveTreeMap } from '@nivo/treemap';
import React from 'react';

import { CardErrorMessage } from '../CardErrorMessage';
import { chartTheme, chartColorPalette } from '../../containers/Analytics';
import { LoadingSpinner } from '../LoadingSpinner';
import { TreeMapChartNode } from '../../../../server/src/routes/analytics';

export const TreeMapChart: React.FC<{
  root: TreeMapChartNode;
  isLoading: boolean;
}> = ({ root, isLoading }) => {
  const isNotEmpty =
    root.children &&
    !!root.children.find(child => child.children && child.children.length > 0);

  return (
    <div className="chart-wrapper generic-card" id="treemapchart">
      <h3 className="chart-title">Last Month Detailed Expenses</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="chart-container">
          {isNotEmpty ? (
            <ResponsiveTreeMap
              colors={[
                chartColorPalette[7],
                chartColorPalette[6],
                chartColorPalette[5],
              ]}
              identity="title"
              label="title"
              innerPadding={12}
              labelSkipSize={12}
              labelTextColor="white"
              theme={chartTheme}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              outerPadding={12}
              root={root}
              value="sum"
            />
          ) : (
            <CardErrorMessage message="Please import more transactions before you can see this chart" />
          )}
        </div>
      )}
    </div>
  );
};
