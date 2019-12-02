import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/Budget.scss';
import { ActionBar } from '../components/ActionBar';
import { BudgetCategory } from '../components/Budget/BudgetCategory';
import { State } from '../store/reducers';
import { getBudgets } from '../store/actions/budgets';

export const Budget: React.FC = () => {
  const dispatch = useDispatch();
  const getInitialBudgets = useCallback(() => {
    dispatch(getBudgets());
  }, [dispatch]);
  const budgets = useSelector((state: State) => state.budgets.budgets);

  useEffect(() => {
    getInitialBudgets();
  }, [getInitialBudgets]);

  return (
    <div className="budget-container">
      <ActionBar />
      <h2 className="section-title">Budget</h2>
      <p className="section-subtitle">Set your monthly goals</p>
      <div className="budget-content-container">
        <div className="budget-categories-container">
          {budgets.map(budgetCategory => (
            <BudgetCategory
              key={`budget-category-${budgetCategory.categoryId}`}
              title={budgetCategory.title}
              initialValue={budgetCategory.amount}
            />
          ))}
        </div>
        <div className="total-container">
          <h3 className="total-title">Total</h3>
          <div className="total-amount">
            {budgets.reduce((a, b) => a + b.amount, 0)}
          </div>
        </div>
      </div>
    </div>
  );
};
