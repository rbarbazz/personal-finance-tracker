import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getOperations } from '../../store/actions/operations';
import { Operation } from '../../../../server/src/db/models';
import { SelectOption } from '../../store/reducers/operations';
import { State } from '../../store/reducers';
import { UpsertOperationDialog } from './UpsertOperationDialog';

const updateCategory = async (categoryId: number, operationId: number) => {
  try {
    const res = await fetch(`/operations/${operationId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryId }),
    });
    if (res.status === 200) {
    }
  } catch (error) {
    console.error(error);
  }
};

const delOperation = async (dispatch: Function, operationId: number) => {
  try {
    const res = await fetch(`/operations/${operationId}`, {
      method: 'DELETE',
    });
    if (res.status === 200) dispatch(getOperations());
  } catch (error) {
    console.error(error);
  }
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
      <TableCell component="th" scope="row">
        {dateLocale}
      </TableCell>
      <TableCell>{amount}</TableCell>
      <TableCell>{label}</TableCell>
      <TableCell style={{ minWidth: 200, maxWidth: 200 }}>
        <Select
          className={'category-select'}
          classNamePrefix="category-select"
          menuPosition="fixed"
          onChange={selectedOption => {
            setCategory(selectedOption);
            if (selectedOption) updateCategory(selectedOption.value, id);
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
          className="row-action-btn"
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
          className="row-action-btn"
          onClick={() => {
            delOperation(dispatch, id);
          }}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};
