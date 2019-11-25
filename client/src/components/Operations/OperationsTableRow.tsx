import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Select from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { getOperations } from '../../store/actions/operations';
import { OperationRow } from '../../../../server/src/db/models';
import { State } from '../../store/reducers';
import { UpsertOperationDialog } from './UpsertOperationDialog';
import { SelectOption } from '../../store/reducers/operations';

export const OperationTableRow: React.FC<{
  operation: OperationRow;
}> = ({ operation }) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: State) => state.operations.categories);
  const { id, operationDate, amount, label, categoryId } = operation;
  const dateLocale = new Date(operationDate).toISOString().substring(0, 10);
  const [editOperationVisible, toggleEditDialog] = useState(false);
  const [selectedCategory, setCategory] = useState<SelectOption | any>(
    categories.find(category => category.value === categoryId),
  );

  const delOperation = async () => {
    try {
      const res = await fetch(`/operations/${id}`, {
        method: 'DELETE',
      });
      if (res.status === 200) {
        dispatch(getOperations());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateCategory = async (categoryId: number) => {
    try {
      const res = await fetch(`/operations/${id}`, {
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
            if (selectedOption) updateCategory(selectedOption.value);
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
            delOperation();
          }}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};
