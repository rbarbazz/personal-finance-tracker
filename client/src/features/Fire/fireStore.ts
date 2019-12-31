// Actions
const UPDATE_FIRE_PARAM = 'UPDATE_FIRE_PARAM';

interface UpdateFireParamAction {
  type: typeof UPDATE_FIRE_PARAM;
  param: string;
  value: number;
}

type FireActionTypes = UpdateFireParamAction;

// Reducers
export type FireState = {
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
