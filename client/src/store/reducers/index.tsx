import { combineReducers } from 'redux';

import { user, UserState } from './user';

export interface State {
  user: UserState;
}

const reducers = combineReducers({ user });

export default reducers;