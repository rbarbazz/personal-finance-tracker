import { BarChartData, LineChartData } from '../../../../common/common';
import { logout } from '../../components/SideMenu';
import { TreeMapChartNode } from '../../../../server/src/routes/analytics';

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

export const fetchMonthlyBar = () => {
  return async (dispatch: Function) => {
    dispatch(requestMonthlyBar());
    try {
      const res = await fetch('/analytics/monthlybar', { method: 'GET' });
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
      const res = await fetch('/analytics/treemap', { method: 'GET' });
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
      const res = await fetch('/analytics/budgetline', { method: 'GET' });
      if (res.status === 200) {
        const { budgetLineChart } = await res.json();

        dispatch(receiveBudgetLine(budgetLineChart));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};
