import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useEffect } from 'react';

import '../styles/Fire.scss';
import { ActionBar } from '../components/ActionBar';
import { fetchBudgetLine } from '../store/actions/analytics';
import { FireNumberCalculator } from '../components/Fire/FireNumberCalculator';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';

export const Fire: React.FC = () => {
  const dispatch = useDispatch();
  const getAverages = useCallback(() => {
    dispatch(fetchBudgetLine());
  }, [dispatch]);
  const isFetchingBudgetLine = useSelector(
    (state: State) => state.analytics.isFetchingBudgetLine,
  );
  const averages = useSelector((state: State) => state.analytics.averages);

  useEffect(() => getAverages(), [getAverages]);

  return (
    <div className="page-container">
      <ActionBar></ActionBar>
      <div className="content-container">
        <SectionHeader
          subtitle="Calculate your FIRE number and plan your way to early retirement."
          title="FIRE Calculators"
        />
        <div className="inner-content-container">
          <FireNumberCalculator
            averageExpenses={averages[1].amount}
            averageIncomes={averages[0].amount}
            isLoading={isFetchingBudgetLine}
          />
        </div>
      </div>
    </div>
  );
};
