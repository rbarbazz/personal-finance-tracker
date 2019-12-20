import { LabelledField } from '../LabelledField';
import { LoadingSpinner } from '../LoadingSpinner';
import React, { useState, useEffect } from 'react';

export const FireNumberCalculator: React.FC<{
  averageExpenses: number;
  averageIncomes: number;
  isLoading: boolean;
}> = ({ averageExpenses, averageIncomes, isLoading }) => {
  const [age, setAge] = useState(35);
  const [expectedROI, setExpectedROI] = useState(4);
  const [expenses, setExpenses] = useState(averageExpenses);
  const [incomes, setIncomes] = useState(averageIncomes);
  const [netWorth, setNetWorth] = useState(0);
  const [savingsRate, setSavingsRate] = useState(50);

  // useEffect(() => {
  //   let portfolioValue = netWorth;
  //   const monthlyROIRate = expectedROI / 12 / 100;
  //   const monthlyIncomesSavings = incomes * (savingsRate / 100);
  //   const afterExpenses = monthlyIncomesSavings - expenses;
  //   let index = 0;

  //   while (portfolioValue <= expenses * 300) {
  //     const monthlyEarnings = portfolioValue * monthlyROIRate + afterExpenses;

  //     console.log(portfolioValue);
  //     if (monthlyEarnings < 0) break;
  //     portfolioValue += monthlyEarnings;
  //     index += 1;
  //   }
  //   console.log(index / 12);
  // }, [expectedROI, expenses, incomes, netWorth, savingsRate]);

  return (
    <div className="generic-card fire-number-card">
      <h3 className="generic-card-title">1. FIRE Number</h3>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <p className="generic-card-subtitle">
            Input your monthly expenses goal (default to monthly average) to get
            the amount you need to save to achieve financial independance. Based
            on a 4% yearly return rate after inflation, this is the amount that
            will maintain your current standard of living.
          </p>
          <div className="fire-number-calculation">
            <LabelledField
              id="fire-number-expenses"
              setter={setExpenses}
              type="number"
              value={expenses}
            >
              Monthly Expenses
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
              setter={setAge}
              type="number"
              value={age}
            >
              Current Age
            </LabelledField>
            <LabelledField
              id="fire-number-net-worth"
              setter={setNetWorth}
              type="number"
              value={netWorth}
            >
              Current Net Worth
            </LabelledField>
            <LabelledField
              id="fire-number-incomes"
              setter={setIncomes}
              type="number"
              value={incomes}
            >
              Monthly Incomes
            </LabelledField>
            <LabelledField
              id="fire-number-savings-rate"
              setter={setSavingsRate}
              type="number"
              value={savingsRate}
            >
              Savings Rate in %
            </LabelledField>
            <LabelledField
              id="fire-number-expected-roi"
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
              <div className="fire-number-amount">{0 / 12}</div>
            </div>
            <div className="fire-number-amount-container">
              <p className="fire-amount-explanation">Retirement Age</p>
              <div className="fire-number-amount">{0 + age}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
