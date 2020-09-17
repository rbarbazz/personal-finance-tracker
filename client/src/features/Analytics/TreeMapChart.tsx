import { ResponsiveTreeMap } from '@nivo/treemap'
import React from 'react'

import { CardErrorMessage } from '../../common/CardErrorMessage'
import { chartTheme, colorsByCategory } from './Analytics'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { ResponsiveChart } from '../../common/ResponsiveChart'
import { TreeMapChartNode } from '../../../../shared'

export const TreeMapChart: React.FC<{
  root: TreeMapChartNode
  isLoading: boolean
}> = ({ root, isLoading }) => {
  const isNotEmpty =
    root.children &&
    !!root.children.find((child) => child.children && child.children.length > 0)

  return (
    <div className="chart-wrapper generic-card" id="treemapchart">
      <h3 className="generic-card-title">Last Month Detailed Expenses</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <ResponsiveChart>
          {isNotEmpty ? (
            <ResponsiveTreeMap
              colors={[
                colorsByCategory['Expenses'],
                colorsByCategory['Housing'],
                colorsByCategory['Budget'],
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
        </ResponsiveChart>
      )}
    </div>
  )
}
