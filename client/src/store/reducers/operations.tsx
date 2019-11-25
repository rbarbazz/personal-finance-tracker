import {
  OperationsActionTypes,
  RECEIVE_CATEGORIES,
  RECEIVE_OPERATIONS,
  REQUEST_CATEGORIES,
  REQUEST_OPERATIONS,
  REQUEST_UPSERT,
  RESPONSE_UPSERT,
} from '../actions/operations';
import { OperationRow } from '../../../../server/src/db/models';

export type SelectOption = {
  label: string;
  value: number;
};

export type OperationsState = {
  categories: SelectOption[];
  isFetchingCategories: boolean;
  isFetchingOperations: boolean;
  isMakingUpsert: boolean;
  operations: OperationRow[];
};

const initialState = {
  categories: [] as SelectOption[],
  isFetchingCategories: false,
  isFetchingOperations: false,
  isMakingUpsert: false,
  operations: [] as OperationRow[],
};

export const operations = (
  state = initialState,
  action: OperationsActionTypes,
) => {
  switch (action.type) {
    case REQUEST_CATEGORIES:
      return { ...state, isFetchingCategories: true };
    case RECEIVE_CATEGORIES:
      return {
        ...state,
        categories: action.categories,
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
    default:
      return state;
  }
};
