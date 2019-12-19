import { LabelledField } from '../LabelledField';
import { LoadingSpinner } from '../LoadingSpinner';
import React, { useState } from 'react';

export const FireNumberCalculator: React.FC<{
  averageExpenses: number;
  isLoading: boolean;
}> = ({ averageExpenses, isLoading }) => {
  const [expenses, setExpenses] = useState(averageExpenses);

  return (
    <div className="generic-card fire-number-card">
      <h3 className="generic-card-title">FIRE Number</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="generic-card-subtitle">
            Input your monthly expenses goal (default to monthly average)
          </p>
          <LabelledField setter={setExpenses} type="number" value={expenses} />
          <p className="fire-number-explanation generic-card-subtitle">
            Here is the amount you need to reach
          </p>
          <div className="fire-number-amount">{`$ ${expenses * 300}`}</div>
        </>
      )}
    </div>
  );
};
