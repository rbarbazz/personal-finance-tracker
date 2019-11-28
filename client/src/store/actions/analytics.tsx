import {
  MonthlyBarChartData,
  TreeMapChartRoot,
} from '../../../../server/src/routes/charts';

export const REQUEST_MONTHLY_BAR = 'REQUEST_MONTHLY_BAR';
export const RECEIVE_MONTHLY_BAR = 'RECEIVE_MONTHLY_BAR';
export const REQUEST_TREEMAP = 'REQUEST_TREEMAP';
export const RECEIVE_TREEMAP = 'RECEIVE_TREEMAP';

interface RequestMonthlyBarAction {
  type: typeof REQUEST_MONTHLY_BAR;
}

interface ReceiveMonthlyBarAction {
  type: typeof RECEIVE_MONTHLY_BAR;
  monthlyBarChart: MonthlyBarChartData;
}

interface RequestTreeMapAction {
  type: typeof REQUEST_TREEMAP;
}

interface ReceiveTreeMapAction {
  type: typeof RECEIVE_TREEMAP;
  treeMapChart: TreeMapChartRoot;
}

export type AnalyticsActionTypes =
  | RequestMonthlyBarAction
  | ReceiveMonthlyBarAction
  | RequestTreeMapAction
  | ReceiveTreeMapAction;

const requestMonthlyBar = (): AnalyticsActionTypes => ({
  type: REQUEST_MONTHLY_BAR,
});

const receiveMonthlyBar = (
  monthlyBarChart: MonthlyBarChartData,
): AnalyticsActionTypes => ({ monthlyBarChart, type: RECEIVE_MONTHLY_BAR });

const requestTreeMap = (): AnalyticsActionTypes => ({
  type: REQUEST_TREEMAP,
});

const receiveTreeMap = (
  treeMapChart: TreeMapChartRoot,
): AnalyticsActionTypes => ({ treeMapChart, type: RECEIVE_TREEMAP });

export const fetchMonthlyBar = () => {
  return async (dispatch: Function) => {
    dispatch(requestMonthlyBar());
    try {
      const res = await fetch('/charts/monthlybar', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { monthlyBarChart } = await res.json();

        dispatch(receiveMonthlyBar(monthlyBarChart));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const fetchTreeMap = () => {
  return async (dispatch: Function) => {
    dispatch(requestTreeMap());
    try {
      const res = await fetch('/charts/treemap', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { treeMapChart } = await res.json();

        dispatch(receiveTreeMap(treeMapChart));
      }
    } catch (error) {
      console.error(error);
    }
  };
};
