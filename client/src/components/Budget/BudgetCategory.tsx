import React, { useState } from 'react';

import { getBudgets } from '../../store/actions/budgets';
import { LabelledField } from '../LabelledField';
import { logout } from '../SideMenu';
import { TableRow, TableCell } from '@material-ui/core';
import { useDispatch } from 'react-redux';

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
        dispatch(logout());
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
