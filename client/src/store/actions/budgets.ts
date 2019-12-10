import { BudgetCategoryType } from '../../../../server/src/routes/budgets';
import { logout } from '../../components/SideMenu';

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

export const getBudgets = (selectedMonth: Date) => {
  return async (dispatch: Function) => {
    dispatch(requestBudgets());
    try {
      const res = await fetch(
        `/budgets?selectedMonth=${selectedMonth.getMonth()}&selectedYear=${selectedMonth.getFullYear()}`,
        {
          method: 'GET',
        },
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
