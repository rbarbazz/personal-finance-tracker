import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getOperations } from '../../store/actions/operations';
import { logout } from '../SideMenu';
import { Operation } from '../../../../server/src/db/models';
import { SelectOption } from '../../store/reducers/operations';
import { State } from '../../store/reducers';
import { UpsertOperationDialog } from './UpsertOperationDialog';

const updateCategory = (categoryId: number, operationId: number) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch(`/api/operations/${operationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });
      if (res.status === 200) {
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

const delOperation = (operationId: number) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch(`/api/operations/${operationId}`, {
        method: 'DELETE',
      });
      if (res.status === 200) dispatch(getOperations());
      else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const OperationTableRow: React.FC<{
  operation: Operation;
}> = ({ operation }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: State) => state.operations.categories);
  const { id, operationDate, amount, label, categoryId } = operation;
  const dateLocale = new Date(operationDate).toISOString().substring(0, 10);
  const [editOperationVisible, toggleEditDialog] = useState(false);
  const [selectedCategory, setCategory] = useState<SelectOption | any>(
    categories.find(category => category.value === categoryId),
  );

  return (
    <TableRow>
      <TableCell>
        <span className="generic-chip">{dateLocale}</span>
      </TableCell>
      <TableCell>
        <span className="amount-cell">{amount}</span>
      </TableCell>
      <TableCell>{label}</TableCell>
      <TableCell style={{ minWidth: 200, maxWidth: 200 }}>
        <Select
          className={'category-select'}
          classNamePrefix="category-select"
          menuPosition="fixed"
          onChange={selectedOption => {
            setCategory(selectedOption);
            if (selectedOption)
              dispatch(updateCategory(selectedOption.value, id));
          }}
          options={categories}
          theme={theme => ({
            ...theme,
            borderRadius: 0,
            colors: {
              ...theme.colors,
              primary: '#007944',
            },
          })}
          value={selectedCategory}
        />
      </TableCell>
      <TableCell>
        <button
          className="generic-row-action-btn"
          onClick={() => {
            toggleEditDialog(true);
          }}
        >
          Edit
        </button>
        {editOperationVisible && (
          <UpsertOperationDialog
            toggleDialog={toggleEditDialog}
            initialOperation={{
              id,
              operationDate,
              amount,
              label,
              categoryId,
            }}
            isEdit
          />
        )}
        <button
          className="generic-row-action-btn"
          onClick={() => {
            dispatch(delOperation(id));
          }}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};
