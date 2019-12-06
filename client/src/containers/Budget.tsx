import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { ResponsivePie } from '@nivo/pie';
import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/Budget.scss';
import { ActionBar } from '../components/ActionBar';
import { BudgetCategory } from '../components/Budget/BudgetCategory';
import { chartTheme, chartColorPalette } from './Analytics';
import { getBudgets } from '../store/actions/budgets';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { State } from '../store/reducers';
import { SectionHeader } from '../components/SectionHeader';
import { CardErrorMessage } from '../components/CardErrorMessage';

export const Budget: React.FC = () => {
  const dispatch = useDispatch();
  const getInitialBudgets = useCallback(
    () => dispatch(getBudgets(new Date())),
    [dispatch],
  );
  const budgets = useSelector((state: State) => state.budgets.budgets);
  const isFetchingBudgets = useSelector(
    (state: State) => state.budgets.isFetchingBudgets,
  );
  const budgetTotal = budgets.reduce((a, b) => a + b.amount, 0);

  useEffect(() => {
    getInitialBudgets();
  }, [getInitialBudgets]);

  return (
    <div className="budget-container">
      <ActionBar />
      <SectionHeader
        subtitle={`Set your monthly goals by category. You can use the "Uncategorized" category to match the total goal you want to achieve.`}
        title="Monthly Budget"
      />
      <div className="budget-content-container">
        <div className="budget-categories-container">
          {isFetchingBudgets ? (
            <LoadingSpinner />
          ) : (
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
          )}
        </div>
        <div className="budget-right-col">
          <div className="total-container generic-card">
            {isFetchingBudgets ? (
              <LoadingSpinner />
            ) : (
              <>
                <h3 className="total-title">Total</h3>
                <div className="total-amount">{`$ ${budgetTotal}`}</div>
              </>
            )}
          </div>
          <div
            className="budget-pie-chart-container generic-card"
            style={
              isFetchingBudgets || budgetTotal < 1
                ? { flex: 1 }
                : { height: '100%' }
            }
          >
            <h3 className="chart-title">Budget Monthly Repartition</h3>
            {isFetchingBudgets ? (
              <LoadingSpinner />
            ) : budgetTotal > 0 ? (
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
            ) : (
              <CardErrorMessage message="Please update your monthly budget before you can see this chart" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
