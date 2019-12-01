import {
  OperationsActionTypes,
  RECEIVE_CATEGORIES,
  RECEIVE_OPERATIONS,
  REQUEST_CATEGORIES,
  REQUEST_OPERATIONS,
  REQUEST_UPSERT,
  RESPONSE_UPSERT,
} from '../actions/operations';
import { Operation } from '../../../../server/src/db/models';
import { USER_LOGGED_OUT, UserActionTypes } from '../actions/user';

export type SelectOption = {
  label: string;
  value: number;
};

export type OperationsState = {
  categories: SelectOption[];
  isFetchingCategories: boolean;
  isFetchingOperations: boolean;
  isMakingUpsert: boolean;
  operations: Operation[];
};

const initialState = {
  categories: [] as SelectOption[],
  isFetchingCategories: false,
  isFetchingOperations: false,
  isMakingUpsert: false,
  operations: [] as Operation[],
};

export const operations = (
  state = initialState,
  action: OperationsActionTypes | UserActionTypes,
) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return { ...state, isFetchingCategories: true };
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories.sort((a, b) =>
          a.label > b.label ? 1 : -1,
        ),
        isFetchingCategories: false,
      };
    case REQUEST_OPERATIONS:
      return { ...state, isFetchingOperations: true };
    case RECEIVE_OPERATIONS:
      return {
        ...state,
        operations: action.operations,
        isFetchingOperations: false,
      };
    case REQUEST_UPSERT:
      return {
        ...state,
        isMakingUpsert: true,
      };
    case RESPONSE_UPSERT:
      return {
        ...state,
        isMakingUpsert: false,
      };
    case USER_LOGGED_OUT:
      return initialState;
    default:
      return state;
  }
};
