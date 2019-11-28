import { useSelector, useDispatch } from 'react-redux';
import React, { useEffect } from 'react';

import '../styles/Analytics.scss';
import { fetchMonthlyBar, fetchTreeMap } from '../store/actions/analytics';
import { GenericBtn } from '../components/GenericBtn';
import { MonthlyBarChart } from '../components/Analytics/MonthlyBarChart';
import { ReactComponent as Sync } from '../icons/Sync.svg';
import { State } from '../store/reducers';
import { TreeMapChart } from '../components/Analytics/TreeMapChart';

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
    if (treeMapChart.root.children && treeMapChart.root.children.length < 1)
      dispatch(fetchTreeMap());
  }, []);

  return (
    <div className="dashboard-main-container">
      <div className="dashboard-top-container">
        <GenericBtn
          action={() => {
            if (!isFetchingMonthlyBar && !isFetchingTreeMap) {
              dispatch(fetchMonthlyBar());
              dispatch(fetchTreeMap());
            }
          }}
          value={
            <>
              {'Refresh Charts'}
              <Sync />
            </>
          }
        />
      </div>
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
