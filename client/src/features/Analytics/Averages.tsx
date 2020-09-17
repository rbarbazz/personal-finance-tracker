import React from 'react'

import { LoadingSpinner } from '../../common/LoadingSpinner'

export const Averages: React.FC<{
  averages: { amount: number; title: string }[]
  isLoading: boolean
}> = ({ averages, isLoading }) => (
  <div className="text-card-containter">
    {averages.map((average) => (
      <div key={average.title} className="generic-card">
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="text-card-amount">{`$ ${average.amount}`}</div>
            <h3 className="generic-card-title">{`Monthly Average ${average.title}`}</h3>
            <p className="generic-card-subtitle">Last three months</p>
          </>
        )}
      </div>
    ))}
  </div>
)
