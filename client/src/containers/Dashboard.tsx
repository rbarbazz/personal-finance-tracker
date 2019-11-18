import React, { useEffect, useState } from 'react';

import '../styles/Dashboard.scss';
import { SideMenu } from '../components/SideMenu';
import { LoadingBars } from '../components/LoadingBars';
import { MonthlyBarChart } from '../components/Dashboard/MonthlyBarChart';

export const Dashboard: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [charts, setCharts] = useState<
    | {
        [index: string]: { keys: string[]; data: object[] };
      }
    | undefined
  >(undefined);
  const getChartsData = async () => {
    try {
      const res = await fetch('/charts', {
        method: 'GET',
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
      console.error(error);
    }
  };
  useEffect(() => {
    getChartsData();
  }, []);

  return (
    <div className="main-container">
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="dashboard-container">
        <h2 className="section-title">Analysis</h2>
        {charts ? (
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
