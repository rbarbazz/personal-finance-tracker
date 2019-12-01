import React, { useState } from 'react';

import { LabelledField } from '../LabelledField';

export const BudgetCategory: React.FC<{
  title: string;
  initialValue: number;
}> = ({ title, initialValue }) => {
  const [categoryBudget, setCategoryBudget] = useState(initialValue);
  const [isEditing, toggleIsEditing] = useState(false);

  return (
    <div className="budget-category-item">
      {title}
      <div>
        <LabelledField
          disabled={!isEditing}
          setter={setCategoryBudget}
          type="number"
          value={categoryBudget}
        />
        <div className="budget-action-wrapper">
          <button
            className="budget-category-action"
            onClick={() => toggleIsEditing(prevState => !prevState)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
};
