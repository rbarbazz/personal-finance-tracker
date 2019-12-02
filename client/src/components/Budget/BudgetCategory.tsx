import React, { useState } from 'react';

import { LabelledField } from '../LabelledField';
import { useDispatch } from 'react-redux';
import { getBudgets } from '../../store/actions/budgets';
import { TableRow, TableCell } from '@material-ui/core';

const updateBudgetAmount = (categoryBudget: number, categoryId: number) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: categoryBudget, categoryId }),
      });
      if (res.status === 200) {
        const { error } = await res.json();

        if (!error) {
          dispatch(getBudgets());
        }
      } else {
        console.error('User not logged in');
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const BudgetCategory: React.FC<{
  categoryId: number;
  title: string;
  initialValue: number;
}> = ({ categoryId, title, initialValue }) => {
  const dispatch = useDispatch();
  const [categoryBudget, setCategoryBudget] = useState(initialValue);
  const [isEditing, toggleIsEditing] = useState(false);

  return (
    <TableRow>
      <TableCell>
        <span className="generic-chip">{title}</span>
      </TableCell>
      <TableCell align="right">
        <div className="category-amount-container">
          <LabelledField
            disabled={!isEditing}
            setter={setCategoryBudget}
            type="number"
            value={categoryBudget}
          />
          <div className="action-button-wrapper">
            <button
              className="generic-row-action-btn"
              onClick={() => {
                if (isEditing)
                  dispatch(updateBudgetAmount(categoryBudget, categoryId));
                toggleIsEditing(prevState => !prevState);
              }}
            >
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
