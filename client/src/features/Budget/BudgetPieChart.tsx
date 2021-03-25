import { ResponsivePie } from '@nivo/pie'
import React from 'react'

import { BudgetCategoryType } from '../../../../shared'
import { CardErrorMessage } from '../../common/CardErrorMessage'
import { chartTheme, colorsByCategory } from '../Analytics/Analytics'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { ResponsiveChart } from '../../common/ResponsiveChart'

export const BudgetPieChart: React.FC<{
  isLoading: boolean
  root: BudgetCategoryType[]
  total: number
}> = ({ isLoading, root, total }) => {
  const data = root
    .filter((budget) => budget.amount > 0)
    .map((budget) => {
      const { amount, title } = budget

      return {
        id: title,
        label: title,
        value: amount,
      }
    })

  return (
    <div className="budget-pie-chart-container generic-card">
      {isLoading ? (
        <LoadingSpinner />
      ) : total > 0 ? (
        <ResponsiveChart>
          <ResponsivePie
            colors={(pie) => colorsByCategory[pie.id]}
            cornerRadius={3}
            data={data}
            enableRadialLabels={false}
            innerRadius={0.5}
            margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
            padAngle={1}
            sliceLabel="id"
            sliceLabelsTextColor="white"
            theme={chartTheme}
          />
        </ResponsiveChart>
      ) : (
        <CardErrorMessage message="Please update your monthly budget before you can see this chart" />
      )}
    </div>
  )
}
