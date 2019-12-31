import { TableRow, TableCell } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';

import { colorsByCategory } from '../Analytics/Analytics';
import { getBudgets } from './budgetStore';
import { LabelledField } from '../../common/LabelledField';
import { logout } from '../../common/SideMenu';
import { ReactComponent as CardIcon } from '../../icons/Categories/Card.svg';
import { ReactComponent as CarIcon } from '../../icons/Categories/Car.svg';
import { ReactComponent as CartIcon } from '../../icons/Categories/Cart.svg';
import { ReactComponent as HouseIcon } from '../../icons/Categories/House.svg';
import { ReactComponent as PeopleIcon } from '../../icons/Categories/People.svg';
import { ReactComponent as PercentIcon } from '../../icons/Categories/Percent.svg';
import { ReactComponent as QuestionIcon } from '../../icons/Categories/Question.svg';
import { ReactComponent as TrendingUpIcon } from '../../icons/Categories/TrendingUp.svg';
import { State } from '../../app/rootReducer';

const updateBudgetAmount = (
  categoryBudget: number,
  categoryId: number,
  selectedMonth: Date,
) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: categoryBudget,
          categoryId,
          selectedMonth: selectedMonth.getMonth(),
          selectedYear: selectedMonth.getFullYear(),
        }),
      });
      if (res.status === 200) {
        const { error } = await res.json();

        if (!error) {
          dispatch(getBudgets(selectedMonth));
        }
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };
};

const iconsByCategory: {
  [index: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
  'Daily Life': CartIcon,
  'Family Care': PeopleIcon,
  Debt: CardIcon,
  Housing: HouseIcon,
  Savings: TrendingUpIcon,
  Taxes: PercentIcon,
  Transport: CarIcon,
  Uncategorized: QuestionIcon,
};

export const BudgetCategory: React.FC<{
  categoryId: number;
  title: string;
  initialValue: number;
}> = ({ categoryId, title, initialValue }) => {
  const dispatch = useDispatch();
  const [categoryBudget, setCategoryBudget] = useState(initialValue);
  const [isEditing, toggleIsEditing] = useState(false);
  const selectedMonth = useSelector(
    (state: State) => state.budgets.selectedMonth,
  );
  const CategoryIcon = iconsByCategory[title];

  return (
    <TableRow>
      <TableCell align="center">
        {iconsByCategory[title] && (
          <CategoryIcon style={{ fill: colorsByCategory[title] }} />
        )}
      </TableCell>
      <TableCell>
        <span
          className="generic-chip"
          style={{ backgroundColor: colorsByCategory[title] }}
        >
          {title}
        </span>
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
                  dispatch(
                    updateBudgetAmount(
                      categoryBudget,
                      categoryId,
                      selectedMonth,
                    ),
                  );
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
