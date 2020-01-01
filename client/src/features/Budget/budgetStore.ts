import { BudgetCategoryType } from '../../../../shared';
import { logout } from '../../common/SideMenu';
import { UserActionTypes, USER_LOGGED_OUT } from '../Profile/user';

// Actions
export const REQUEST_BUDGETS = 'REQUEST_BUDGETS';
export const RECEIVE_BUDGETS = 'RECEIVE_BUDGETS';
export const SELECT_MONTH = 'SELECT_MONTH';

interface RequestBudgetsAction {
  type: typeof REQUEST_BUDGETS;
}

interface ReceiveBudgetsAction {
  budgets: BudgetCategoryType[];
  type: typeof RECEIVE_BUDGETS;
}

interface SelectMonthAction {
  selectedMonth: Date;
  type: typeof SELECT_MONTH;
}

export type BudgetsActionTypes =
  | RequestBudgetsAction
  | ReceiveBudgetsAction
  | SelectMonthAction;

export type BudgetsState = {
  budgets: BudgetCategoryType[];
  isFetchingBudgets: boolean;
  selectedMonth: Date;
};

// Reducer
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

// Action Creators
export const requestBudgets = (): BudgetsActionTypes => ({
  type: REQUEST_BUDGETS,
});

export const receiveBudgets = (
  budgets: BudgetCategoryType[],
): BudgetsActionTypes => ({
  budgets,
  type: RECEIVE_BUDGETS,
});

export const selectMonth = (selectedMonth: Date): BudgetsActionTypes => ({
  selectedMonth,
  type: SELECT_MONTH,
});

// Side Effects
export const getBudgets = (selectedMonth: Date) => {
  return async (dispatch: Function) => {
    dispatch(requestBudgets());
    try {
      const res = await fetch(
        `/api/budgets?selectedMonth=${selectedMonth.getMonth()}&selectedYear=${selectedMonth.getFullYear()}`,
        { method: 'GET' },
      );
      if (res.status === 200) {
        const { budgets } = await res.json();

        dispatch(receiveBudgets(budgets));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const updateBudgetAmount = (
  categoryBudgetAmount: number,
  categoryId: number,
  selectedMonth: Date,
) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: categoryBudgetAmount,
          categoryId,
          selectedMonth: selectedMonth.getMonth(),
          selectedYear: selectedMonth.getFullYear(),
        }),
      });
      if (res.status === 200) {
        const { error } = await res.json();

        if (!error) dispatch(getBudgets(selectedMonth));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};
