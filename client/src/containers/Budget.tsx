import { ResponsivePie } from '@nivo/pie';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/Budget.scss';
import { ActionBar } from '../components/ActionBar';
import { BudgetCategory } from '../components/Budget/BudgetCategory';
import { State } from '../store/reducers';
import { getBudgets } from '../store/actions/budgets';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { chartTheme, chartColorPalette } from './Analytics';

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
      <p className="section-subtitle">
        Set your monthly goals by category. You can use the "Uncategorized"
        category to match the total goal you want to achieve.
      </p>
      <div className="budget-content-container">
        <div className="budget-categories-container">
          <Table stickyHeader aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {budgets.map(budgetCategory => (
                <BudgetCategory
                  categoryId={budgetCategory.categoryId}
                  key={`budget-category-${budgetCategory.categoryId}`}
                  title={budgetCategory.title}
                  initialValue={budgetCategory.amount}
                />
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="budget-right-col">
          <div className="total-container">
            <h3 className="total-title">Total</h3>
            <div className="total-amount">
              {`$ ${budgets.reduce((a, b) => a + b.amount, 0)}`}
            </div>
          </div>
          <div className="budget-pie-chart-container">
            <ResponsivePie
              colors={chartColorPalette}
              cornerRadius={3}
              data={budgets
                .filter(budget => budget.amount > 0)
                .map(budget => {
                  const { amount, title } = budget;

                  return {
                    id: title,
                    label: title,
                    value: amount,
                  };
                })}
              enableRadialLabels={false}
              innerRadius={0.5}
              margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
              padAngle={1}
              sliceLabel="id"
              slicesLabelsTextColor="white"
              theme={chartTheme}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
