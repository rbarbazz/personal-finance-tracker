import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { OperationRow } from '../../../../server/src/db/models';
import { OperationTableRow } from './OperationsTableRow';

export const OperationTable: React.FC<{
  operationList: OperationRow[];
  getOperations: Function;
}> = ({ operationList, getOperations }) => {
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
          {operationList.map((row: OperationRow) => (
            <OperationTableRow
              key={`row${row.id}`}
              getOperations={getOperations}
              operation={row}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
