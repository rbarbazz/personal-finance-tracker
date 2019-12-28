import { combineReducers } from 'redux';

import { analytics, AnalyticsState } from '../features/Analytics/analytics';
import { budgets, BudgetsState } from '../features/Budget/budgets';
import { fire, FireState } from '../features/Fire/fire';
import { operations, OperationsState } from '../features/Operations/operations';
import { user, UserState } from '../features/Profile/user';

export interface State {
  analytics: AnalyticsState;
  budgets: BudgetsState;
  fire: FireState;
  operations: OperationsState;
  user: UserState;
}

const reducers = combineReducers({
  analytics,
  budgets,
  fire,
  operations,
  user,
});

export default reducers;
