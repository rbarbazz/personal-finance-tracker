export const REQUEST_USER_STATUS = 'REQUEST_USER_STATUS';
export const RECEIVE_USER_STATUS = 'RECEIVE_USER_STATUS';
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

interface RequestUserStatusAction {
  type: typeof REQUEST_USER_STATUS;
}

interface ReceiveUserStatusAction {
  type: typeof RECEIVE_USER_STATUS;
  isLoggedIn: boolean;
  fName: string;
}

interface UserLoggedInAction {
  type: typeof USER_LOGGED_IN;
  fName: string;
}

interface UserLoggedOutAction {
  type: typeof USER_LOGGED_OUT;
}

export type UserActionTypes =
  | RequestUserStatusAction
  | ReceiveUserStatusAction
  | UserLoggedInAction
  | UserLoggedOutAction;

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
