import React from 'react';

import '../../styles/MonthPicker.scss';
import { ReactComponent as ArrowLeftOutlineIcon } from '../../icons/ArrowLeftOutline.svg';
import { ReactComponent as ArrowRightOutlineIcon } from '../../icons/ArrowRightOutline.svg';

export const MonthPicker: React.FC<{ selectedMonth: Date }> = ({
  selectedMonth,
}) => (
  <div className="month-selector-container">
    <ArrowLeftOutlineIcon />
    <div className="selected-month">
      {selectedMonth.toISOString().slice(0, 7)}
    </div>
    <ArrowRightOutlineIcon />
  </div>
);
