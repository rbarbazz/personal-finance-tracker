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
