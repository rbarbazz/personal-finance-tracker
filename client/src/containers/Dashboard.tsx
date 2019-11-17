import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';

import '../styles/Dashboard.scss';
import { SideMenu } from '../components/SideMenu';
import { LoadingBars } from '../components/LoadingBars';

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
          <>
            <h3 className="chart-title">Expenses Monthly Repartition</h3>
            <div className="chart-container">
              <ResponsiveBar
                colors={{ scheme: 'nivo' }}
                indexBy="month"
                padding={0.3}
                labelSkipHeight={15}
                keys={charts.monthlyBarChart.keys}
                margin={{ top: 0, right: 20, bottom: 50, left: 60 }}
                data={charts.monthlyBarChart.data}
                axisBottom={{
                  legend: 'Month',
                  legendPosition: 'middle',
                  legendOffset: 40,
                }}
                axisLeft={{
                  legend: 'Expense',
                  legendPosition: 'middle',
                  legendOffset: -55,
                }}
                theme={{
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
                      fill: 'red',
                      fontFamily: '"Nunito", sans-serif',
                      fontSize: 14,
                    },
                  },
                  tooltip: { container: { color: 'black' } },
                }}
              />
            </div>
          </>
        ) : (
          <LoadingBars />
        )}
      </div>
    </div>
  );
};
