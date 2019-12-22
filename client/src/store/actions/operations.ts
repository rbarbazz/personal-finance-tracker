import { logout } from '../../components/SideMenu';
import { Operation, Category } from '../../../../server/src/db/models';
import { SelectOption } from '../reducers/operations';

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

export const requestCategories = (): OperationsActionTypes => ({
  type: REQUEST_CATEGORIES,
});

export const receiveCategories = (
  categories: SelectOption[],
): OperationsActionTypes => ({
  categories,
  type: RECEIVE_CATEGORIES,
});

const requestOperations = (): OperationsActionTypes => ({
  type: REQUEST_OPERATIONS,
});

const receiveOperations = (operations: Operation[]): OperationsActionTypes => ({
  operations,
  type: RECEIVE_OPERATIONS,
});

export const requestUpsert = (): OperationsActionTypes => ({
  type: REQUEST_UPSERT,
});

export const responseUpsert = (): OperationsActionTypes => ({
  type: RESPONSE_UPSERT,
});

export const getCategories = () => {
  return async (dispatch: Function) => {
    dispatch(requestCategories());
    try {
      const res = await fetch('/api/categories', { method: 'GET' });
      if (res.status === 200) {
        const { categories }: { categories: Category[] } = await res.json();

        const selectCategories = categories.map(({ id, title }: Category) => ({
          value: id,
          label: title,
        }));
        dispatch(receiveCategories(selectCategories));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const getOperations = () => {
  return async (dispatch: Function) => {
    dispatch(requestOperations());
    try {
      const res = await fetch('/api/operations', { method: 'GET' });
      if (res.status === 200) {
        const { operations }: { operations: Operation[] } = await res.json();

        dispatch(receiveOperations(operations));
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};
