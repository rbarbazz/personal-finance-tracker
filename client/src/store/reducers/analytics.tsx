import {
  AnalyticsActionTypes,
  RECEIVE_MONTHLY_BAR,
  REQUEST_MONTHLY_BAR,
  REQUEST_TREEMAP,
  RECEIVE_TREEMAP,
} from '../actions/analytics';
import { USER_LOGGED_OUT, UserActionTypes } from '../actions/user';
import {
  MonthlyBarChartData,
  TreeMapChartNode,
} from '../../../../server/src/routes/charts';

export type AnalyticsState = {
  isFetchingMonthlyBar: boolean;
  isFetchingTreeMap: boolean;
  monthlyBarChart: MonthlyBarChartData;
  treeMapChart: TreeMapChartNode;
};

const initialState: AnalyticsState = {
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
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};
