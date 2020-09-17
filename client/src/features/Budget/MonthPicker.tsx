import { useDispatch } from 'react-redux'
import React from 'react'

import './MonthPicker.scss'
import { ReactComponent as ArrowLeftOutlineIcon } from '../../icons/ArrowLeftOutline.svg'
import { ReactComponent as ArrowRightOutlineIcon } from '../../icons/ArrowRightOutline.svg'
import { selectMonth } from './budgetStore'

export const MonthPicker: React.FC<{ selectedMonth: Date }> = ({
  selectedMonth,
}) => {
  const dispatch = useDispatch()

  return (
    <div className="month-selector-container">
      <ArrowLeftOutlineIcon
        onClick={() => {
          const prevMonth = new Date(selectedMonth)

          prevMonth.setMonth(selectedMonth.getMonth() - 1)
          prevMonth.setDate(1)
          dispatch(selectMonth(prevMonth))
        }}
      />
      <div className="selected-month">
        {selectedMonth.toISOString().slice(0, 7)}
      </div>
      <ArrowRightOutlineIcon
        onClick={() => {
          const prevMonth = new Date(selectedMonth)

          prevMonth.setMonth(selectedMonth.getMonth() + 1)
          prevMonth.setDate(1)
          dispatch(selectMonth(prevMonth))
        }}
      />
    </div>
  )
}
