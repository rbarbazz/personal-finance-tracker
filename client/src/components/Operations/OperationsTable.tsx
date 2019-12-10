import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { CardErrorMessage } from '../CardErrorMessage';
import { LoadingSpinner } from '../LoadingSpinner';
import { Operation } from '../../../../server/src/db/models';
import { OperationTableRow } from './OperationsTableRow';

export const OperationTable: React.FC<{
  isLoading: boolean;
  operations: Operation[];
}> = ({ isLoading, operations }) => {
  if (isLoading) return <LoadingSpinner />;

  if (operations.length < 1)
    return (
      <CardErrorMessage message="Please import more transactions before you can see this table" />
    );

  return (
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
        {operations.map(row => (
          <OperationTableRow key={`row${row.id}`} operation={row} />
        ))}
      </TableBody>
    </Table>
  );
};
