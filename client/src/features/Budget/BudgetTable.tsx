import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { BudgetCategory } from './BudgetCategory';
import { BudgetCategoryType } from '../../../../shared';
import { LoadingSpinner } from '../../common/LoadingSpinner';

export const BudgetTable: React.FC<{
  budgets: BudgetCategoryType[];
  isLoading: boolean;
}> = ({ budgets, isLoading }) => {
  return (
    <div className="budget-categories-container generic-card">
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Table stickyHeader aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell />
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
  );
};
