import { combineReducers } from 'redux';

import { analytics, AnalyticsState } from './analytics';
import { budgets, BudgetsState } from './budgets';
import { operations, OperationsState } from './operations';
import { user, UserState } from './user';

export interface State {
  analytics: AnalyticsState;
  budgets: BudgetsState;
  operations: OperationsState;
  user: UserState;
}

const reducers = combineReducers({ analytics, budgets, operations, user });

export default reducers;
