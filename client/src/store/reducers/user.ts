import {
  RECEIVE_USER_STATUS,
  REQUEST_USER_STATUS,
  UPDATE_FNAME_SUCCESS,
  USER_LOGGED_IN,
  UserActionTypes,
} from '../actions/user';

export type UserState = {
  fName: string;
  isFetchingStatus: boolean;
  isLoggedIn: boolean;
};

const initialState: UserState = {
  fName: '',
  isFetchingStatus: false,
  isLoggedIn: false,
};

export const user = (state = initialState, action: UserActionTypes) => {
  switch (action.type) {
    case REQUEST_USER_STATUS:
      return { ...state, isFetchingStatus: true };
    case RECEIVE_USER_STATUS:
      return {
        isFetchingStatus: false,
        isLoggedIn: action.isLoggedIn,
        fName: action.fName,
      };
    case USER_LOGGED_IN:
      return { ...state, fName: action.fName, isLoggedIn: true };
    case UPDATE_FNAME_SUCCESS:
      return { ...state, fName: action.fName };
    default:
      return state;
  }
};
