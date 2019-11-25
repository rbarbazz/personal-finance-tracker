import {
  AnalyticsActionTypes,
  RECEIVE_MONTHLY_BAR,
  REQUEST_MONTHLY_BAR,
  REQUEST_TREEMAP,
  RECEIVE_TREEMAP,
} from '../actions/analytics';
import { USER_LOGGED_OUT, UserActionTypes } from '../actions/user';

export type MonthlyBarChartRoot = {
  data: object[];
  keys: string[];
};

type TreeMapChild = { title: string; sum: number };

export type TreeMapChartRoot = {
  root: {
    title: string;
    children?: { title: string; children: TreeMapChild[] }[];
  };
};

export type AnalyticsState = {
  isFetchingMonthlyBar: boolean;
  isFetchingTreeMap: boolean;
  monthlyBarChart: MonthlyBarChartRoot;
  treeMapChart: TreeMapChartRoot;
};

const initialState: AnalyticsState = {
  isFetchingMonthlyBar: false,
  isFetchingTreeMap: false,
  monthlyBarChart: { data: [], keys: [] },
  treeMapChart: { root: { title: 'Expenses' } },
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
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};
