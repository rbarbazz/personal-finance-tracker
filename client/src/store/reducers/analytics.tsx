import {
  AnalyticsActionTypes,
  RECEIVE_BUDGET_LINE,
  RECEIVE_MONTHLY_BAR,
  RECEIVE_TREEMAP,
  REQUEST_BUDGET_LINE,
  REQUEST_MONTHLY_BAR,
  REQUEST_TREEMAP,
} from '../actions/analytics';
import { USER_LOGGED_OUT, UserActionTypes } from '../actions/user';
import {
  BudgetLineChartNode,
  MonthlyBarChartData,
  TreeMapChartNode,
} from '../../../../server/src/routes/charts';

export type AnalyticsState = {
  budgetLineChart: BudgetLineChartNode[];
  isFetchingBudgetLine: boolean;
  isFetchingMonthlyBar: boolean;
  isFetchingTreeMap: boolean;
  monthlyBarChart: MonthlyBarChartData;
  treeMapChart: TreeMapChartNode;
};

const initialState: AnalyticsState = {
  budgetLineChart: [] as BudgetLineChartNode[],
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
        budgetLineChart: action.budgetLineChart,
        isFetchingBudgetLine: false,
      };
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};
