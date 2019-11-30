import React from 'react';
import { ResponsiveTreeMap } from '@nivo/treemap';

import { LoadingBars } from '../LoadingBars';
import { TreeMapChartNode } from '../../../../server/src/routes/charts';

export const TreeMapChart: React.FC<{
  root: TreeMapChartNode;
  isLoading: boolean;
}> = ({ root, isLoading }) => (
  <div className="chart-wrapper" id="treemapchart">
    {isLoading ? (
      <LoadingBars />
    ) : (
      <>
        <h3 className="chart-title">Last Month Detailed Expenses</h3>
        <div className="chart-container">
          {root.children && root.children.length > 0 ? (
            <ResponsiveTreeMap
              colors={['#ffa600', '#809a13', '#007944']}
              identity="title"
              label="title"
              innerPadding={9}
              labelSkipSize={12}
              labelTextColor="white"
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fill: 'black',
                      fontFamily: '"Nunito", sans-serif',
                      fontSize: 14,
                    },
                  },
                },
                labels: {
                  text: {
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 14,
                  },
                },
                tooltip: { container: { color: 'black' } },
              }}
              margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              outerPadding={9}
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
