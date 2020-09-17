import { combineReducers } from 'redux'

import { analytics, AnalyticsState } from '../features/Analytics/analyticsStore'
import { budgets, BudgetsState } from '../features/Budget/budgetStore'
import { fire, FireState } from '../features/Fire/fireStore'
import {
  operations,
  OperationsState,
} from '../features/Operations/operationsStore'
import { user, UserState } from '../features/Profile/user'

export interface State {
  analytics: AnalyticsState
  budgets: BudgetsState
  fire: FireState
  operations: OperationsState
  user: UserState
}

const reducers = combineReducers({
  analytics,
  budgets,
  fire,
  operations,
  user,
})

export default reducers
