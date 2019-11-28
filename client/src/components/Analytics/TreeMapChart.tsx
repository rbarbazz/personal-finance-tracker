import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';

import { LoadingBars } from '../LoadingBars';
import { TreeMapChartRoot } from '../../../../server/src/routes/charts';

export const TreeMapChart: React.FC<{
  root: TreeMapChartRoot;
  isLoading: boolean;
}> = ({ root, isLoading }) => (
  <div className="chart-wrapper" id="treemapchart">
    {isLoading ? (
      <LoadingBars />
    ) : (
      <>
        <h3 className="chart-title">Last Month Detailed Expenses</h3>
        <div className="chart-container">
          {root.root.children && root.root.children.length > 0 ? (
            <ResponsiveTreeMap
              colors={['#790035', '#a62537', '#ce4b32', '#ec7623', '#ffa600']}
              identity="title"
              label="title"
              innerPadding={3}
              labelSkipSize={12}
              margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
              outerPadding={3}
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
