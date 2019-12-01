import {
  BudgetsActionTypes,
  RECEIVE_BUDGETS,
  REQUEST_BUDGETS,
} from '../actions/budgets';
import { BudgetCategory } from '../../../../server/src/routes/budgets';

export type BudgetsState = {
  budgets: BudgetCategory[];
  isFetchingBudgets: boolean;
};

const initialState = {
  budgets: [] as BudgetCategory[],
  isFetchingBudgets: false,
};

export const budgets = (state = initialState, action: BudgetsActionTypes) => {
  switch (action.type) {
    case REQUEST_BUDGETS:
      return { ...state, isFetchingBudgets: true };
    case RECEIVE_BUDGETS:
      return {
        ...state,
        budgets: action.budgets.sort((a, b) => (a.title > b.title ? 1 : -1)),
        isFetchingBudgets: false,
      };
    default:
      return state;
  }
};
