import React, { useEffect, useState } from 'react';

import '../styles/Dashboard.scss';
import { LoadingBars } from '../components/LoadingBars';
import { MonthlyBarChart } from '../components/Dashboard/MonthlyBarChart';
import { SideMenu } from '../components/SideMenu';

export const Dashboard: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [charts, setCharts] = useState<{
    [index: string]: { keys: string[]; data: object[] };
  }>({});

  useEffect(() => {
    const abortController = new AbortController();
    const getChartsData = async () => {
      try {
        const res = await fetch('/charts', {
          method: 'GET',
          signal: abortController.signal,
        });
        if (res.status === 200) {
          const {
            charts,
          }: {
            charts: { [index: string]: { keys: string[]; data: object[] } };
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
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="dashboard-container">
        <h2 className="section-title">Analysis</h2>
        {Object.keys(charts).length > 0 ? (
          charts.monthlyBarChart.data.length > 0 && (
            <MonthlyBarChart
              keys={charts.monthlyBarChart.keys}
              data={charts.monthlyBarChart.data}
            />
          )
        ) : (
          <LoadingBars />
        )}
      </div>
    </div>
  );
};
