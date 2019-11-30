import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';

import '../styles/Analytics.scss';
import { fetchMonthlyBar, fetchTreeMap } from '../store/actions/analytics';
import { GenericBtn } from '../components/GenericBtn';
import { MonthlyBarChart } from '../components/Analytics/MonthlyBarChart';
import { ReactComponent as Sync } from '../icons/Sync.svg';
import { State } from '../store/reducers';
import { TreeMapChart } from '../components/Analytics/TreeMapChart';
import { ActionBar } from '../components/ActionBar';

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

  useEffect(() => {
    if (monthlyBarChart.data.length < 1) dispatch(fetchMonthlyBar());
    if (treeMapChart.children!.length < 1) dispatch(fetchTreeMap());
  });

  return (
    <div className="dashboard-main-container">
      <ActionBar>
        <GenericBtn
          action={() => {
            if (!isFetchingMonthlyBar && !isFetchingTreeMap) {
              dispatch(fetchMonthlyBar());
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
      <h2 className="section-title">Analytics</h2>
      <div className="charts-container">
        <MonthlyBarChart
          root={monthlyBarChart}
          isLoading={isFetchingMonthlyBar}
        />
        <TreeMapChart root={treeMapChart} isLoading={isFetchingTreeMap} />
      </div>
    </div>
  );
};
