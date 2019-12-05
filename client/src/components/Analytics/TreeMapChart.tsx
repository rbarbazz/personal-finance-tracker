import { ResponsiveTreeMap } from '@nivo/treemap';
import React from 'react';

import { chartTheme, chartColorPalette } from '../../containers/Analytics';
import { LoadingSpinner } from '../LoadingSpinner';
import { TreeMapChartNode } from '../../../../server/src/routes/analytics';

export const TreeMapChart: React.FC<{
  root: TreeMapChartNode;
  isLoading: boolean;
}> = ({ root, isLoading }) => (
  <div className="chart-wrapper generic-card" id="treemapchart">
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <>
        <h3 className="chart-title">Last Month Detailed Expenses</h3>
        <div className="chart-container">
          {root.children && root.children.length > 0 ? (
            <ResponsiveTreeMap
              colors={[
                chartColorPalette[7],
                chartColorPalette[6],
                chartColorPalette[5],
              ]}
              identity="title"
              label="title"
              innerPadding={15}
              labelSkipSize={12}
              labelTextColor="white"
              theme={chartTheme}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              outerPadding={15}
              root={root}
              value="sum"
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
