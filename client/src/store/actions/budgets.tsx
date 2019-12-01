import { BudgetCategory } from '../../../../server/src/routes/budgets';

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

export const getBudgets = () => {
  return async (dispatch: Function) => {
    dispatch(requestBudgets());
    try {
      const res = await fetch('/budgets', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { budgets } = await res.json();

        dispatch(receiveBudgets(budgets));
      }
    } catch (error) {
      console.error(error);
    }
  };
};
