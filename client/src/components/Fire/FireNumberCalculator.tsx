import { LabelledField } from '../LabelledField';
import { LoadingSpinner } from '../LoadingSpinner';
import React, { useState, useEffect } from 'react';
import { InfoMessage } from '../InfoMessage';

export const FireNumberCalculator: React.FC<{
  averageExpenses: number;
  averageIncomes: number;
  isLoading: boolean;
}> = ({ averageExpenses, averageIncomes, isLoading }) => {
  const [age, setAge] = useState(35);
  const [expectedROI, setExpectedROI] = useState(4);
  const [expenses, setExpenses] = useState(averageExpenses);
  const [incomes, setIncomes] = useState(averageIncomes);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [netWorth, setNetWorth] = useState(0);
  const [savingsRate, setSavingsRate] = useState(50);
  const [yearsToRet, setYearsToRet] = useState(0);

  useEffect(() => {
    setMessage({ error: false, value: '' });
    let portfolioValue = netWorth;
    const monthlyROIRate = expectedROI / 12 / 100;
    const monthlyIncomesSavings = incomes * (savingsRate / 100);
    let index = 0;

    while (portfolioValue <= expenses * 300) {
      let monthlyEarnings = monthlyIncomesSavings;

      if (portfolioValue > 0)
        monthlyEarnings += portfolioValue * monthlyROIRate;
      portfolioValue += monthlyEarnings;
      index += 1;
      if (index > 1200)
        return setMessage({
          error: true,
          value: 'Be realistic, this would take more than a lifetime...',
        });
    }
    setYearsToRet(index / 12);
  }, [expectedROI, expenses, incomes, netWorth, savingsRate]);

  return (
    <div className="generic-card fire-number-card">
      <h3 className="generic-card-title">1. FIRE Number</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="generic-card-subtitle">
            Input your monthly expenses goal (default to your current monthly
            average) to get the amount you need to save to achieve financial
            independance. Based on a 4% yearly return rate after inflation, this
            is the amount that will maintain your current standard of living.
          </p>
          <div className="fire-number-calculation">
            <LabelledField
              id="fire-number-expenses"
              min={0}
              setter={setExpenses}
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
          <h3 className="generic-card-title">2. Retirement Plan</h3>
          <p className="generic-card-subtitle">
            Now time to do the math and calculate when you can expect to reach
            that number. Play around with the different parameters to adjust the
            conditions of your journey towards Financial Independance.
          </p>
          <div className="fire-number-calculation">
            <LabelledField
              id="fire-number-age"
              min={0}
              setter={setAge}
              type="number"
              value={age}
            >
              Current Age
            </LabelledField>
            <LabelledField
              id="fire-number-net-worth"
              setter={setNetWorth}
              step={100}
              type="number"
              value={netWorth}
            >
              Current Net Worth
            </LabelledField>
            <LabelledField
              id="fire-number-incomes"
              min={0}
              setter={setIncomes}
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
              setter={setSavingsRate}
              type="number"
              value={savingsRate}
            >
              Savings Rate in %
            </LabelledField>
            <LabelledField
              id="fire-number-expected-roi"
              max={100}
              min={0}
              setter={setExpectedROI}
              type="number"
              value={expectedROI}
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
        </>
      )}
    </div>
  );
};
