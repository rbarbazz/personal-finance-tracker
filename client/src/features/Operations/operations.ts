import { logout } from '../../common/SideMenu';
import { Operation, Category } from '../../../../server/src/db/models';
import { UserActionTypes, USER_LOGGED_OUT } from '../Profile/user';

// Actions
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

// Reducers
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

// Action Creators
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

// Side Effects
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
