import { combineReducers } from 'redux';

import { analytics, AnalyticsState } from '../features/Analytics/analytics';
import { budgets, BudgetsState } from '../features/Budget/budgets';
import { operations, OperationsState } from '../features/Operations/operations';
import { user, UserState } from '../features/Profile/user';

export interface State {
  analytics: AnalyticsState;
  budgets: BudgetsState;
  operations: OperationsState;
  user: UserState;
}

const reducers = combineReducers({ analytics, budgets, operations, user });

export default reducers;
