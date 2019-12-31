import React, { useState, useEffect } from 'react';

import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../app/rootReducer';
import { updateFireParam } from './fireStore';

const currentYear = new Date().getFullYear();

export const FireNumberCalculator: React.FC<{
  setChartData: Function;
}> = ({ setChartData }) => {
  const dispatch = useDispatch();
  const {
    age,
    expectedRoi,
    expenses,
    incomes,
    netWorth,
    savingsRate,
  } = useSelector((state: State) => state.fire.params);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [yearsToRet, setYearsToRet] = useState(0);

  useEffect(() => {
    const fireNumber = expenses * 300;
    const quarterIncomesSavings = incomes * 4 * (savingsRate / 100);
    const quarterROIRate = expectedRoi / 4 / 100;
    const newChartData = [];
    let index = 0;
    let hasReachedFire = false;
    let portfolioValue = netWorth;

    setMessage({ error: false, value: '' });

    while (portfolioValue < fireNumber * 1.1) {
      let quarterEarnings = quarterIncomesSavings;

      // Add up quarterly incomes
      if (portfolioValue > 0)
        quarterEarnings += portfolioValue * quarterROIRate;
      portfolioValue += quarterEarnings;

      // Add data point every year
      if (index % 4 === 0)
        newChartData.push({
          x: (currentYear + index / 4).toString(),
          y: Math.round(portfolioValue),
        });
      index += 1;

      // Check that values aren't nonsense
      if (index > 1200)
        return setMessage({
          error: true,
          value: 'Be realistic, this would take more than a lifetime...',
        });

      // Save index when reached FIRE number
      if (portfolioValue >= fireNumber && !hasReachedFire) {
        hasReachedFire = true;
        setYearsToRet(index / 4);
      }
    }
    setChartData(newChartData);
  }, [expectedRoi, expenses, incomes, netWorth, savingsRate, setChartData]);

  return (
    <div className="generic-card fire-number-card">
      <div className="fire-number-col">
        <h3 className="generic-card-title">1. FIRE Number</h3>
        <p className="generic-card-subtitle">
          Input your monthly expenses goal (default to your current monthly
          average) to get the amount you need to save to achieve financial
          independance.
        </p>
        <p className="generic-card-subtitle">
          Based on a 4% yearly return rate after inflation, this is the amount
          that will maintain your current standard of living.
        </p>
        <div className="fire-number-calculation">
          <LabelledField
            id="fire-number-expenses"
            min={0}
            setter={(value: number) =>
              dispatch(updateFireParam('expenses', value))
            }
            step={100}
            type="number"
            value={expenses}
          >
            Monthly Expenses Goal
          </LabelledField>
          <div className="generic-card-separator" />
          <div className="fire-number-amount-container">
            <p className="fire-amount-explanation">Your FIRE number</p>
            <div className="fire-number-amount">{`$ ${expenses * 300}`}</div>
          </div>
        </div>
      </div>
      <div className="generic-vertical-separator" />
      <div className="fire-number-col">
        <h3 className="generic-card-title">2. Retirement Plan</h3>
        <p className="generic-card-subtitle">
          Now time to do the math and calculate when you can expect to reach
          that number. Play around with the different parameters to adjust the
          conditions of your journey towards Financial Independance.
        </p>
        <p className="generic-card-subtitle">
          This simulation is based on quarterly paid dividends.
        </p>
        <div className="fire-number-calculation">
          <LabelledField
            id="fire-number-age"
            min={0}
            setter={(value: number) => dispatch(updateFireParam('age', value))}
            type="number"
            value={age}
          >
            Current Age
          </LabelledField>
          <LabelledField
            id="fire-number-net-worth"
            setter={(value: number) =>
              dispatch(updateFireParam('netWorth', value))
            }
            step={100}
            type="number"
            value={netWorth}
          >
            Current Net Worth
          </LabelledField>
          <LabelledField
            id="fire-number-incomes"
            min={0}
            setter={(value: number) =>
              dispatch(updateFireParam('incomes', value))
            }
            step={100}
            type="number"
            value={incomes}
          >
            Monthly Incomes
          </LabelledField>
          <LabelledField
            id="fire-number-savings-rate"
            max={100}
            min={0}
            setter={(value: number) =>
              dispatch(updateFireParam('savingsRate', value))
            }
            type="number"
            value={savingsRate}
          >
            Savings Rate in %
          </LabelledField>
          <LabelledField
            id="fire-number-expected-roi"
            max={100}
            min={0}
            setter={(value: number) =>
              dispatch(updateFireParam('expectedRoi', value))
            }
            type="number"
            value={expectedRoi}
          >
            Expected Yearly ROI in %
          </LabelledField>
          <div className="generic-card-separator" />
          <div className="fire-number-amount-container">
            <p className="fire-amount-explanation">
              Years before Financial Independance
            </p>
            <div className="fire-number-amount">{yearsToRet.toFixed(1)}</div>
          </div>
          <div className="fire-number-amount-container">
            <p className="fire-amount-explanation">Retirement Age</p>
            <div className="fire-number-amount">
              {(yearsToRet + age).toFixed(1)}
            </div>
          </div>
          {message.value !== '' && (
            <InfoMessage error={message.error} value={message.value} />
          )}
        </div>
      </div>
    </div>
  );
};
