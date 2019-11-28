import { SelectOption } from '../reducers/operations';
import { Operation } from '../../../../server/src/db/models';

export const REQUEST_CATEGORIES = 'REQUEST_CATEGORIES';
export const RECEIVE_CATEGORIES = 'RECEIVE_CATEGORIES';

export const REQUEST_OPERATIONS = 'REQUEST_OPERATIONS';
export const RECEIVE_OPERATIONS = 'RECEIVE_OPERATIONS';

export const REQUEST_UPSERT = 'REQUEST_UPSERT';
export const RESPONSE_UPSERT = 'RESPONSE_UPSERT';

interface RequestCategoriesAction {
  type: typeof REQUEST_CATEGORIES;
}

interface ReceiveCategoriesAction {
  type: typeof RECEIVE_CATEGORIES;
  categories: SelectOption[];
}

interface RequestOperationsAction {
  type: typeof REQUEST_OPERATIONS;
}

interface ReceiveOperationsAction {
  type: typeof RECEIVE_OPERATIONS;
  operations: Operation[];
}

interface RequestUpsertAction {
  type: typeof REQUEST_UPSERT;
}

interface ResponseUpsertAction {
  type: typeof RESPONSE_UPSERT;
}

export type OperationsActionTypes =
  | RequestCategoriesAction
  | ReceiveCategoriesAction
  | RequestOperationsAction
  | ReceiveOperationsAction
  | RequestUpsertAction
  | ResponseUpsertAction;

export const requestCategories = () => ({ type: REQUEST_CATEGORIES });

export const receiveCategories = (categories: SelectOption[]) => ({
  categories,
  type: RECEIVE_CATEGORIES,
});

const requestOperations = () => ({ type: REQUEST_OPERATIONS });

const receiveOperations = (operations: Operation[]) => ({
  operations,
  type: RECEIVE_OPERATIONS,
});

export const getOperations = () => {
  return async (dispatch: Function) => {
    dispatch(requestOperations());
    try {
      const res = await fetch('/operations', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { operations }: { operations: Operation[] } = await res.json();

        dispatch(receiveOperations(operations));
      }
    } catch (error) {
      console.error(error);
    }
  };
};

export const requestUpsert = () => ({ type: REQUEST_UPSERT });

export const responseUpsert = () => ({ type: RESPONSE_UPSERT });
