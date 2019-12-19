import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/Budget.scss';
import { ActionBar } from '../components/ActionBar';
import { BudgetPieChart } from '../components/Budget/BudgetPieChart';
import { BudgetTable } from '../components/Budget/BudgetTable';
import { getBudgets } from '../store/actions/budgets';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { MonthPicker } from '../components/Budget/MonthPicker';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';

export const Budget: React.FC = () => {
  const dispatch = useDispatch();
  const selectedMonth = useSelector(
    (state: State) => state.budgets.selectedMonth,
  );
  const budgets = useSelector((state: State) => state.budgets.budgets);
  const isFetchingBudgets = useSelector(
    (state: State) => state.budgets.isFetchingBudgets,
  );
  const budgetTotal = budgets.reduce((a, b) => a + b.amount, 0);
  const getInitialBudgets = useCallback(
    () => dispatch(getBudgets(selectedMonth)),
    [dispatch, selectedMonth],
  );

  useEffect(() => {
    getInitialBudgets();
  }, [getInitialBudgets]);

  return (
    <div className="page-container">
      <ActionBar />
      <div className="content-container">
        <div className="budget-header">
          <SectionHeader
            subtitle={`Set your monthly goals by category. You can use the "Uncategorized" category to match the total goal you want to achieve.`}
            title="Monthly Budget"
          />
          <MonthPicker selectedMonth={selectedMonth} />
        </div>
        <div className="inner-content-container">
          <div className="budget-col">
            <BudgetTable budgets={budgets} isLoading={isFetchingBudgets} />
          </div>
          <div className="budget-col">
            <BudgetPieChart
              isLoading={isFetchingBudgets}
              root={budgets}
              total={budgetTotal}
            />
            <div className="total-container generic-card">
              {isFetchingBudgets ? (
                <LoadingSpinner />
              ) : (
                <>
                  <h3 className="total-title generic-card-title">Total</h3>
                  <div className="total-amount">{`$ ${budgetTotal}`}</div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
