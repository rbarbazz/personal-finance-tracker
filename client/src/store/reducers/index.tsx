import { combineReducers } from 'redux';

import { analytics, AnalyticsState } from './analytics';
import { operations, OperationsState } from './operations';
import { user, UserState } from './user';

export interface State {
  analytics: AnalyticsState;
  operations: OperationsState;
  user: UserState;
}

const reducers = combineReducers({ analytics, operations, user });

export default reducers;
