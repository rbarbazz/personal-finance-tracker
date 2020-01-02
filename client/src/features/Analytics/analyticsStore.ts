import { BarChartData, LineChartData } from '../../../../shared';
import { logout } from '../../features/Profile/user';
import { TreeMapChartNode } from '../../../../shared';
import { UserActionTypes, USER_LOGGED_OUT } from '../Profile/user';

const average = (array: { x: string; y: number }[]) => {
  if (array.length > 0)
    return parseFloat(
      (array.reduce((a, b) => a + b.y, 0) / array.length).toFixed(2),
    );
  else return 0;
};

// Actions
export const REQUEST_MONTHLY_BAR = 'REQUEST_MONTHLY_BAR';
export const RECEIVE_MONTHLY_BAR = 'RECEIVE_MONTHLY_BAR';
export const REQUEST_TREEMAP = 'REQUEST_TREEMAP';
export const RECEIVE_TREEMAP = 'RECEIVE_TREEMAP';
export const REQUEST_BUDGET_LINE = 'REQUEST_BUDGET_LINE';
export const RECEIVE_BUDGET_LINE = 'RECEIVE_BUDGET_LINE';

interface RequestMonthlyBarAction {
  type: typeof REQUEST_MONTHLY_BAR;
}

interface ReceiveMonthlyBarAction {
  type: typeof RECEIVE_MONTHLY_BAR;
  monthlyBarChart: BarChartData;
}

interface RequestTreeMapAction {
  type: typeof REQUEST_TREEMAP;
}

interface ReceiveTreeMapAction {
  type: typeof RECEIVE_TREEMAP;
  treeMapChart: TreeMapChartNode;
}

interface RequestBudgetLineAction {
  type: typeof REQUEST_BUDGET_LINE;
}

interface ReceiveBudgetLineAction {
  type: typeof RECEIVE_BUDGET_LINE;
  budgetLineChart: LineChartData;
}

export type AnalyticsActionTypes =
  | RequestMonthlyBarAction
  | ReceiveMonthlyBarAction
  | RequestTreeMapAction
  | ReceiveTreeMapAction
  | RequestBudgetLineAction
  | ReceiveBudgetLineAction;

// Reducer
export type AnalyticsState = {
  averages: { amount: number; title: string }[];
  budgetLineChart: LineChartData;
  isFetchingBudgetLine: boolean;
  isFetchingMonthlyBar: boolean;
  isFetchingTreeMap: boolean;
  monthlyBarChart: BarChartData;
  treeMapChart: TreeMapChartNode;
};

const initialState: AnalyticsState = {
  averages: [
    { amount: 0, title: 'Incomes' },
    { amount: 0, title: 'Expenses' },
    { amount: 0, title: 'Savings' },
  ],
  budgetLineChart: [] as LineChartData,
  isFetchingBudgetLine: false,
  isFetchingMonthlyBar: false,
  isFetchingTreeMap: false,
  monthlyBarChart: { data: [], keys: [] },
  treeMapChart: { categoryId: 0, title: 'Expenses', children: [] },
};

export const analytics = (
  state = initialState,
  action: AnalyticsActionTypes | UserActionTypes,
) => {
  switch (action.type) {
    case REQUEST_MONTHLY_BAR:
      return { ...state, isFetchingMonthlyBar: true };
    case RECEIVE_MONTHLY_BAR:
      return {
        ...state,
        monthlyBarChart: action.monthlyBarChart,
        isFetchingMonthlyBar: false,
      };
    case REQUEST_TREEMAP:
      return { ...state, isFetchingTreeMap: true };
    case RECEIVE_TREEMAP:
      return {
        ...state,
        treeMapChart: action.treeMapChart,
        isFetchingTreeMap: false,
      };
    case REQUEST_BUDGET_LINE:
      return { ...state, isFetchingBudgetLine: true };
    case RECEIVE_BUDGET_LINE:
      return {
        ...state,
        averages: [
          {
            amount: average(action.budgetLineChart[3].data.slice(3, 6)),
            title: 'Incomes',
          },
          {
            amount: average(action.budgetLineChart[2].data.slice(3, 6)),
            title: 'Expenses',
          },
          {
            amount: average(action.budgetLineChart[1].data.slice(3, 6)),
            title: 'Savings',
          },
        ],
        budgetLineChart: action.budgetLineChart,
        isFetchingBudgetLine: false,
      };
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};

// Action Creators
const requestMonthlyBar = (): AnalyticsActionTypes => ({
  type: REQUEST_MONTHLY_BAR,
});

const receiveMonthlyBar = (
  monthlyBarChart: BarChartData,
): AnalyticsActionTypes => ({ monthlyBarChart, type: RECEIVE_MONTHLY_BAR });

const requestTreeMap = (): AnalyticsActionTypes => ({
  type: REQUEST_TREEMAP,
});

const receiveTreeMap = (
  treeMapChart: TreeMapChartNode,
): AnalyticsActionTypes => ({ treeMapChart, type: RECEIVE_TREEMAP });

const requestBudgetLine = (): AnalyticsActionTypes => ({
  type: REQUEST_BUDGET_LINE,
});

const receiveBudgetLine = (
  budgetLineChart: LineChartData,
): AnalyticsActionTypes => ({ budgetLineChart, type: RECEIVE_BUDGET_LINE });

// Side Effects
export const fetchMonthlyBar = () => {
  return async (dispatch: Function) => {
    dispatch(requestMonthlyBar());
    try {
      const res = await fetch('/api/analytics/monthlybar', { method: 'GET' });
      if (res.status === 200) {
        const { monthlyBarChart } = await res.json();

        dispatch(receiveMonthlyBar(monthlyBarChart));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchTreeMap = () => {
  return async (dispatch: Function) => {
    dispatch(requestTreeMap());
    try {
      const res = await fetch('/api/analytics/treemap', { method: 'GET' });
      if (res.status === 200) {
        const { treeMapChart } = await res.json();

        dispatch(receiveTreeMap(treeMapChart));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchBudgetLine = () => {
  return async (dispatch: Function) => {
    dispatch(requestBudgetLine());
    try {
      const res = await fetch('/api/analytics/budgetline', { method: 'GET' });
      if (res.status === 200) {
        const { budgetLineChart } = await res.json();

        dispatch(receiveBudgetLine(budgetLineChart));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};
