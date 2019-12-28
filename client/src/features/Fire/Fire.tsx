import { useSelector } from 'react-redux';
import React, { useState } from 'react';

import './Fire.scss';
import { ActionBar } from '../../common/ActionBar';
import { FireNumberCalculator } from './FireNumberCalculator';
import { GenericBtn } from '../../common/GenericBtn';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { RetirementPlanChart } from './RetirementPlanChart';
import { SectionHeader } from '../../common/SectionHeader';
import { State } from '../../app/rootReducer';

export const Fire: React.FC = () => {
  const { expenses } = useSelector((state: State) => state.fire.params);
  const [chartData, setChartData] = useState([] as { x: string; y: number }[]);

  return (
    <div className="page-container">
      <ActionBar>
        <GenericBtn action={() => {}}>
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
          <FireNumberCalculator setChartData={setChartData} />
          <RetirementPlanChart
            fireNumber={expenses * 300}
            root={[{ id: 'portfolio', data: chartData }]}
          />
        </div>
      </div>
    </div>
  );
};
