import {
  BudgetsActionTypes,
  RECEIVE_BUDGETS,
  REQUEST_BUDGETS,
  SELECT_MONTH,
} from '../actions/budgets';
import { BudgetCategoryType } from '../../../../shared';
import { UserActionTypes, USER_LOGGED_OUT } from '../actions/user';

export type BudgetsState = {
  budgets: BudgetCategoryType[];
  isFetchingBudgets: boolean;
  selectedMonth: Date;
};

const initialState = {
  budgets: [] as BudgetCategoryType[],
  isFetchingBudgets: false,
  selectedMonth: new Date(),
};

export const budgets = (
  state = initialState,
  action: BudgetsActionTypes | UserActionTypes,
) => {
  switch (action.type) {
    case REQUEST_BUDGETS:
      return { ...state, isFetchingBudgets: true };
    case RECEIVE_BUDGETS:
      return {
        ...state,
        budgets: action.budgets.sort((a, b) => (a.title > b.title ? 1 : -1)),
        isFetchingBudgets: false,
      };
    case SELECT_MONTH:
      return { ...state, selectedMonth: action.selectedMonth };
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};
