import React, { useState } from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { OperationRow } from '../../../../server/src/db/models';
import { UpsertOperationDialog } from './UpsertOperationDialog';

export const OperationTableRow: React.FC<{
  operation: OperationRow;
  getOperations: Function;
}> = ({ operation, getOperations }) => {
  const [editOperationVisible, toggleEditDialog] = useState(false);
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
  const {
    id,
    operationDate,
    amount,
    label,
    categoryTitle,
    categoryId,
  } = operation;
  const dateLocale = new Date(operationDate).toLocaleDateString();

  return (
    <TableRow key={`row${id}`}>
      <TableCell component="th" scope="row">
        {dateLocale}
      </TableCell>
      <TableCell>{amount}</TableCell>
      <TableCell>{label}</TableCell>
      <TableCell>{categoryTitle}</TableCell>
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
