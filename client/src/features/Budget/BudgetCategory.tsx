import { TableRow, TableCell } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState } from 'react';

import { colorsByCategory } from '../Analytics/Analytics';
import { LabelledField } from '../../common/LabelledField';
import { ReactComponent as CardIcon } from '../../icons/Categories/Card.svg';
import { ReactComponent as CarIcon } from '../../icons/Categories/Car.svg';
import { ReactComponent as CartIcon } from '../../icons/Categories/Cart.svg';
import { ReactComponent as CoinIcon } from '../../icons/Categories/Coin.svg';
import { ReactComponent as HouseIcon } from '../../icons/Categories/House.svg';
import { ReactComponent as PeopleIcon } from '../../icons/Categories/People.svg';
import { ReactComponent as PercentIcon } from '../../icons/Categories/Percent.svg';
import { ReactComponent as QuestionIcon } from '../../icons/Categories/Question.svg';
import { ReactComponent as TrendingUpIcon } from '../../icons/Categories/TrendingUp.svg';
import { State } from '../../app/rootReducer';
import { updateBudgetAmount } from './budgetStore';

export const iconsByCategoryTitle: {
  [index: string]: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
} = {
  'Daily Life': CartIcon,
  'Family Care': PeopleIcon,
  Debt: CardIcon,
  Income: CoinIcon,
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
  const [categoryBudgetAmount, setCategoryBudgetAmount] = useState(
    initialValue,
  );
  const [isEditing, toggleIsEditing] = useState(false);
  const selectedMonth = useSelector(
    (state: State) => state.budgets.selectedMonth,
  );
  const CategoryIcon = iconsByCategoryTitle[title];

  const handleClick = () => {
    if (isEditing)
      dispatch(
        updateBudgetAmount(categoryBudgetAmount, categoryId, selectedMonth),
      );
    toggleIsEditing(prevState => !prevState);
  };

  return (
    <TableRow>
      <TableCell align="center">
        {iconsByCategoryTitle[title] && (
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
            setter={setCategoryBudgetAmount}
            type="number"
            value={categoryBudgetAmount}
          />
          <div className="action-button-wrapper">
            <button className="generic-row-action-btn" onClick={handleClick}>
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
