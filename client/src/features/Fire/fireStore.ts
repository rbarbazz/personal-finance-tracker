import { logout } from '../../common/SideMenu';

// Actions
const UPDATE_FIRE_PARAM = 'UPDATE_FIRE_PARAM';
const REQUEST_FIRE_PARAMS = 'REQUEST_FIRE_PARAMS';
const RECEIVE_FIRE_PARAMS = 'RECEIVE_FIRE_PARAMS';

interface UpdateFireParamAction {
  type: typeof UPDATE_FIRE_PARAM;
  param: string;
  value: number;
}

interface RequestFireParamsAction {
  type: typeof REQUEST_FIRE_PARAMS;
}

interface ReceiveFireParamsAction {
  type: typeof RECEIVE_FIRE_PARAMS;
}

type FireActionTypes =
  | UpdateFireParamAction
  | RequestFireParamsAction
  | ReceiveFireParamsAction;

// Reducers
export type FireState = {
  isFetchingFireParams: boolean;
  params: {
    age: number;
    expectedRoi: number;
    expenses: number;
    incomes: number;
    netWorth: number;
    savingsRate: number;
  };
};

const initialState = {
  isFetchingFireParams: false,
  params: {
    age: 30,
    expectedRoi: 4,
    expenses: 1000,
    incomes: 2000,
    netWorth: 0,
    savingsRate: 50,
  },
};

export const fire = (state = initialState, action: FireActionTypes) => {
  switch (action.type) {
    case UPDATE_FIRE_PARAM:
      return {
        ...state,
        params: { ...state.params, [action.param]: action.value },
      };
    case REQUEST_FIRE_PARAMS:
      return { ...state, isFetchingFireParams: true };
    case RECEIVE_FIRE_PARAMS:
      return { ...state, isFetchingFireParams: false };
    default:
      return state;
  }
};

// Action Creators
export const updateFireParam = (
  param: string,
  value: number,
): FireActionTypes => ({
  type: UPDATE_FIRE_PARAM,
  param,
  value,
});

export const requestFireParams = (): FireActionTypes => ({
  type: REQUEST_FIRE_PARAMS,
});

export const receiveFireParams = (): FireActionTypes => ({
  type: RECEIVE_FIRE_PARAMS,
});

export const getFireParams = () => {
  return async (dispatch: Function) => {
    dispatch(requestFireParams());
    try {
      const res = await fetch('/api/fire', { method: 'GET' });
      if (res.status === 200) {
        const {
          age,
          expectedRoi,
          expenses,
          incomes,
          netWorth,
          savingsRate,
        }: FireState['params'] = await res.json();

        if (age) dispatch(updateFireParam('age', age));
        if (expectedRoi) dispatch(updateFireParam('expectedRoi', expectedRoi));
        if (expenses) dispatch(updateFireParam('expenses', expenses));
        if (incomes) dispatch(updateFireParam('incomes', incomes));
        if (netWorth) dispatch(updateFireParam('netWorth', netWorth));
        if (savingsRate) dispatch(updateFireParam('savingsRate', savingsRate));

        dispatch(receiveFireParams());
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};
