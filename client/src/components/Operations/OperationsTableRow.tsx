import React, { useState } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { OperationRow } from '../../../../server/src/db/models';
import { UpsertOperationDialog } from './UpsertOperationDialog';

export const OperationTableRow: React.FC<{
  categoryList: OptionTypeBase[];
  getOperations: Function;
  operation: OperationRow;
}> = ({ categoryList, operation, getOperations }) => {
  const { id, operationDate, amount, label, categoryId } = operation;
  const dateLocale = new Date(operationDate).toISOString().substring(0, 10);
  const [editOperationVisible, toggleEditDialog] = useState(false);
  const [selectedCategory, setCategory] = useState<OptionTypeBase>(
    categoryList.find(elem => elem.value === categoryId) || {
      value: categoryId,
    },
  );
  const delOperation = async (operationId: number) => {
    try {
      const res = await fetch(`/operations/${operationId}`, {
        method: 'DELETE',
      });
      if (res.status === 200) {
        getOperations();
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
      <TableCell>
        <Select
          classNamePrefix="category-select"
          id="category-select"
          menuPosition="fixed"
          onChange={selectedOption => {
            setCategory(selectedOption);
          }}
          options={categoryList}
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
            getOperations={getOperations}
            categoryList={categoryList}
          />
        )}
        <button
          className="row-action-btn"
          onClick={() => {
            delOperation(id || 0);
          }}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};
