import { BudgetCategory } from '../../../../server/src/routes/budgets';
import { logout } from '../../components/SideMenu';

export const REQUEST_BUDGETS = 'REQUEST_BUDGETS';
export const RECEIVE_BUDGETS = 'RECEIVE_BUDGETS';

interface RequestBudgetsAction {
  type: typeof REQUEST_BUDGETS;
}

interface ReceiveBudgetsAction {
  budgets: BudgetCategory[];
  type: typeof RECEIVE_BUDGETS;
}

export type BudgetsActionTypes = RequestBudgetsAction | ReceiveBudgetsAction;

export const requestBudgets = () => ({ type: REQUEST_BUDGETS });

export const receiveBudgets = (budgets: BudgetCategory[]) => ({
  budgets,
  type: RECEIVE_BUDGETS,
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
