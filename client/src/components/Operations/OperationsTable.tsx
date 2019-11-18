import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { OperationRow } from '../../../../server/models';

export const OperationTable: React.FC<{
  operationList: OperationRow[];
  getOperations: Function;
}> = ({ operationList, getOperations }) => {
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
    <div className="table-container">
      <Table stickyHeader aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Label</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operationList.map((row: OperationRow) => {
            const { id, operationDate, amount, label, categoryTitle } = row;
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
                  <button className="row-action-btn">Edit</button>
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
          })}
        </TableBody>
      </Table>
    </div>
  );
};
