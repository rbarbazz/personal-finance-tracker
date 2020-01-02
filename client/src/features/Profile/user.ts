// Actions
export const REQUEST_USER_STATUS = 'REQUEST_USER_STATUS';
export const RECEIVE_USER_STATUS = 'RECEIVE_USER_STATUS';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';
export const UPDATE_FNAME_SUCCESS = 'UPDATE_FNAME_SUCCESS';

interface RequestUserStatusAction {
  type: typeof REQUEST_USER_STATUS;
}

interface ReceiveUserStatusAction {
  fName: string;
  isLoggedIn: boolean;
  type: typeof RECEIVE_USER_STATUS;
}

interface UserLoggedInAction {
  fName: string;
  type: typeof USER_LOGGED_IN;
}

interface UserLoggedOutAction {
  type: typeof USER_LOGGED_OUT;
}

interface UpdateFNameSuccessAction {
  fName: string;
  type: typeof UPDATE_FNAME_SUCCESS;
}

export type UserActionTypes =
  | RequestUserStatusAction
  | ReceiveUserStatusAction
  | UserLoggedInAction
  | UserLoggedOutAction
  | UpdateFNameSuccessAction;

// Reducer
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

// Action Creators
export const requestUserStatus = (): UserActionTypes => ({
  type: REQUEST_USER_STATUS,
});

export const receiveUserStatus = (
  isLoggedIn: boolean,
  fName: string,
): UserActionTypes => ({
  fName,
  isLoggedIn,
  type: RECEIVE_USER_STATUS,
});

export const userLoggedIn = (fName: string): UserActionTypes => ({
  fName,
  type: USER_LOGGED_IN,
});

export const userLoggedOut = (): UserActionTypes => ({
  type: USER_LOGGED_OUT,
});

export const updatedFName = (fName: string): UserActionTypes => ({
  fName,
  type: UPDATE_FNAME_SUCCESS,
});

// Side Effects
export const logout = () => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'GET' });

      if (res.status === 200) dispatch(userLoggedOut());
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
};
