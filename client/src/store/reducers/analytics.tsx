import {
  AnalyticsActionTypes,
  RECEIVE_BUDGET_LINE,
  RECEIVE_MONTHLY_BAR,
  RECEIVE_TREEMAP,
  REQUEST_BUDGET_LINE,
  REQUEST_MONTHLY_BAR,
  REQUEST_TREEMAP,
} from '../actions/analytics';
import { BudgetLineChartData } from '../../components/Analytics/BudgetLineChart';
import { MonthlyBarChartData } from '../../components/Analytics/MonthlyBarChart';
import { TreeMapChartNode } from '../../../../server/src/routes/analytics';
import { USER_LOGGED_OUT, UserActionTypes } from '../actions/user';

export type AnalyticsState = {
  averages: { amount: string; title: string }[];
  budgetLineChart: BudgetLineChartData;
  isFetchingBudgetLine: boolean;
  isFetchingMonthlyBar: boolean;
  isFetchingTreeMap: boolean;
  monthlyBarChart: MonthlyBarChartData;
  treeMapChart: TreeMapChartNode;
};

const initialState: AnalyticsState = {
  averages: [
    { amount: '0', title: 'Incomes' },
    { amount: '0', title: 'Expenses' },
    { amount: '0', title: 'Savings' },
  ],
  budgetLineChart: [] as BudgetLineChartData,
  isFetchingBudgetLine: false,
  isFetchingMonthlyBar: false,
  isFetchingTreeMap: false,
  monthlyBarChart: { data: [], keys: [] },
  treeMapChart: { categoryId: 0, title: 'Expenses', children: [] },
};

const average = (array: { x: string; y: number }[]) => {
  if (array.length > 0)
    return (array.reduce((a, b) => a + b.y, 0) / array.length).toFixed(2);
  else return '0';
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
          { amount: average(action.budgetLineChart[3].data), title: 'Incomes' },
          {
            amount: average(action.budgetLineChart[2].data),
            title: 'Expenses',
          },
          { amount: average(action.budgetLineChart[1].data), title: 'Savings' },
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
