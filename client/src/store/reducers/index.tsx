import { combineReducers } from 'redux';

import { user, UserState } from './user';
import { operations, OperationsState } from './operations';

export interface State {
  operations: OperationsState;
  user: UserState;
}

const reducers = combineReducers({ operations, user });

export default reducers;
