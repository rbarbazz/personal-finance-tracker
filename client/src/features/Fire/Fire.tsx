import { useSelector, useDispatch } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import './Fire.scss';
import { ActionBar } from '../../common/ActionBar';
import { FireNumberCalculator } from './FireNumberCalculator';
import { FireParams } from '../../../../server/src/db/models';
import { GenericBtn } from '../../common/GenericBtn';
import { getFireParams } from './fireStore';
import { LoadingSpinner } from '../../common/LoadingSpinner';
import { logout } from '../../features/Profile/user';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { RetirementPlanChart } from './RetirementPlanChart';
import { SectionHeader } from '../../common/SectionHeader';
import { State } from '../../app/rootReducer';

const saveFireParams = (params: Partial<FireParams>, setMessage: Function) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/api/fire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error: error, value: message });
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const Fire: React.FC = () => {
  const dispatch = useDispatch();
  const params = useSelector((state: State) => state.fire.params);
  const isFetchingFireParams = useSelector(
    (state: State) => state.fire.isFetchingFireParams,
  );
  const [message, setMessage] = useState({ error: false, value: '' });
  const [chartData, setChartData] = useState([] as { x: string; y: number }[]);
  const getInitialFireParams = useCallback(() => dispatch(getFireParams()), [
    dispatch,
  ]);

  useEffect(() => {
    getInitialFireParams();
  }, [getInitialFireParams]);

  return (
    <div className="page-container">
      <ActionBar>
        <GenericBtn action={() => dispatch(saveFireParams(params, setMessage))}>
          Save
          <SaveIcon />
        </GenericBtn>
      </ActionBar>
      <div className="content-container">
        <SectionHeader
          subtitle="Calculate your FIRE number and plan your way to early retirement."
          title="FIRE Calculators"
        />
        <div className="inner-content-container">
          {isFetchingFireParams ? (
            <LoadingSpinner />
          ) : (
            <>
              <FireNumberCalculator
                message={message}
                setChartData={setChartData}
                setMessage={setMessage}
              />
              <RetirementPlanChart
                fireNumber={params.expenses * 300}
                root={[{ id: 'portfolio', data: chartData }]}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
