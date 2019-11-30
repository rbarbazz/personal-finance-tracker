import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';

import '../styles/Analytics.scss';
import {
  fetchBudgetLine,
  fetchMonthlyBar,
  fetchTreeMap,
} from '../store/actions/analytics';
import { ActionBar } from '../components/ActionBar';
import { BudgetLineChart } from '../components/Analytics/BudgetLineChart';
import { GenericBtn } from '../components/GenericBtn';
import { MonthlyBarChart } from '../components/Analytics/MonthlyBarChart';
import { ReactComponent as Sync } from '../icons/Sync.svg';
import { State } from '../store/reducers';
import { TreeMapChart } from '../components/Analytics/TreeMapChart';

export const chartTheme = {
  axis: {
    ticks: {
      text: {
        fill: 'black',
        fontFamily: '"Nunito", sans-serif',
        fontSize: 14,
      },
    },
    legend: {
      text: {
        fontFamily: '"Nunito", sans-serif',
        fontSize: 14,
        fontWeight: 600,
      },
    },
  },
  labels: {
    text: {
      fontFamily: '"Nunito", sans-serif',
      fontSize: 14,
    },
  },
  legends: {
    text: {
      fill: 'black',
      fontFamily: '"Nunito", sans-serif',
      fontSize: 14,
    },
  },
  tooltip: { container: { color: 'black' } },
};

export const Analytics: React.FC = () => {
  const dispatch = useDispatch();
  const monthlyBarChart = useSelector(
    (state: State) => state.analytics.monthlyBarChart,
  );
  const isFetchingMonthlyBar = useSelector(
    (state: State) => state.analytics.isFetchingMonthlyBar,
  );
  const treeMapChart = useSelector(
    (state: State) => state.analytics.treeMapChart,
  );
  const isFetchingTreeMap = useSelector(
    (state: State) => state.analytics.isFetchingTreeMap,
  );
  const budgetLineChart = useSelector(
    (state: State) => state.analytics.budgetLineChart,
  );
  const isFetchingBudgetLine = useSelector(
    (state: State) => state.analytics.isFetchingBudgetLine,
  );

  useEffect(() => {
    if (monthlyBarChart.data.length < 1) dispatch(fetchMonthlyBar());
    if (budgetLineChart.length < 1) dispatch(fetchBudgetLine());
    if (treeMapChart.children!.length < 1) dispatch(fetchTreeMap());
  }, []);

  return (
    <div className="dashboard-main-container">
      <ActionBar>
        <GenericBtn
          action={() => {
            if (
              !isFetchingMonthlyBar &&
              !isFetchingBudgetLine &&
              !isFetchingTreeMap
            ) {
              dispatch(fetchMonthlyBar());
              dispatch(fetchBudgetLine());
              dispatch(fetchTreeMap());
            }
          }}
          value={
            <>
              {'Refresh'}
              <Sync />
            </>
          }
        />
      </ActionBar>
      <div className="analytics-content-container">
        <h2 className="section-title">Analytics</h2>
        <div className="charts-container">
          <MonthlyBarChart
            root={monthlyBarChart}
            isLoading={isFetchingMonthlyBar}
          />
          <BudgetLineChart
            root={budgetLineChart}
            isLoading={isFetchingBudgetLine}
          />
          <TreeMapChart root={treeMapChart} isLoading={isFetchingTreeMap} />
        </div>
      </div>
    </div>
  );
};
