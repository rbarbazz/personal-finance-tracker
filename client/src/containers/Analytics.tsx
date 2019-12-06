import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

import '../styles/Analytics.scss';
import {
  fetchBudgetLine,
  fetchMonthlyBar,
  fetchTreeMap,
} from '../store/actions/analytics';
import { ActionBar } from '../components/ActionBar';
import { Averages } from '../components/Analytics/Averages';
import { BudgetLineChart } from '../components/Analytics/BudgetLineChart';
import { GenericBtn } from '../components/GenericBtn';
import { MonthlyBarChart } from '../components/Analytics/MonthlyBarChart';
import { ReactComponent as SyncIcon } from '../icons/Sync.svg';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';
import { TreeMapChart } from '../components/Analytics/TreeMapChart';

export const chartTheme = {
  axis: {
    ticks: {
      text: {
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
      fontFamily: '"Nunito", sans-serif',
      fontSize: 14,
    },
  },
  tooltip: { container: { color: 'black' } },
};

export const chartColorPalette = [
  '#5F4690',
  '#1D6996',
  '#38A6A5',
  '#0F8554',
  '#73AF48',
  '#EDAD08',
  '#E17C05',
  '#CC503E',
  '#94346E',
  '#6F4070',
  '#994E95',
  '#666666',
];

const loadingAnimation = {
  webKitAnimation: 'rotate-center 2s linear infinite',
  animation: 'rotate-center 2s linear infinite',
};

export const Analytics: React.FC = () => {
  const dispatch = useDispatch();
  const getInitialCharts = useCallback(() => {
    dispatch(fetchMonthlyBar());
    dispatch(fetchBudgetLine());
    dispatch(fetchTreeMap());
  }, [dispatch]);
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
  const averages = useSelector((state: State) => state.analytics.averages);
  const isFetchingBudgetLine = useSelector(
    (state: State) => state.analytics.isFetchingBudgetLine,
  );
  const isFetchingCharts =
    isFetchingMonthlyBar || isFetchingBudgetLine || isFetchingTreeMap;

  useEffect(() => {
    getInitialCharts();
  }, [getInitialCharts]);

  return (
    <div className="dashboard-main-container">
      <ActionBar>
        <GenericBtn
          action={() => {
            if (!isFetchingCharts) {
              dispatch(fetchMonthlyBar());
              dispatch(fetchBudgetLine());
              dispatch(fetchTreeMap());
            }
          }}
          value={
            <>
              {'Refresh'}
              <SyncIcon style={isFetchingCharts ? loadingAnimation : {}} />
            </>
          }
        />
      </ActionBar>
      <div className="analytics-content-container">
        <SectionHeader
          subtitle="Your personal finances at a glance."
          title="Analytics"
        />
        <div className="charts-container">
          <MonthlyBarChart
            isLoading={isFetchingMonthlyBar}
            root={monthlyBarChart}
          />
          <BudgetLineChart
            isLoading={isFetchingBudgetLine}
            root={budgetLineChart}
          />
          <Averages averages={averages} isLoading={isFetchingBudgetLine} />
          <TreeMapChart isLoading={isFetchingTreeMap} root={treeMapChart} />
        </div>
      </div>
    </div>
  );
};
