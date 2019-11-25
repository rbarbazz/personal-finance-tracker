import React, { useEffect, useState } from 'react';

import '../styles/Analytics.scss';
import { MonthlyBarChart } from '../components/Analytics/MonthlyBarChart';
import { SideMenu } from '../components/SideMenu';
import { TreeMapChart } from '../components/Analytics/TreeMapChart';

type Charts = {
  monthlyBarChart: any;
  treeMapChart: any;
};

export const Analytics: React.FC = () => {
  const [charts, setCharts] = useState<Charts>({
    monthlyBarChart: {},
    treeMapChart: {},
  });
  const [isLoading, toggleLoading] = useState(true);

  useEffect(() => {
    const abortController = new AbortController();
    const getChartsData = async () => {
      try {
        const res = await fetch('/charts', {
          method: 'GET',
          signal: abortController.signal,
        });
        toggleLoading(false);
        if (res.status === 200) {
          const {
            charts,
          }: {
            charts: Charts;
          } = await res.json();

          setCharts(charts);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      }
    };

    getChartsData();

    return () => {
      abortController.abort();
    };
  }, []);

  return (
    <div className="main-container">
      <SideMenu />
      <div className="dashboard-container">
        <MonthlyBarChart
          keys={charts.monthlyBarChart.keys}
          data={charts.monthlyBarChart.data}
          isLoading={isLoading}
        />
        <TreeMapChart root={{}} isLoading={isLoading} />
      </div>
    </div>
  );
};
