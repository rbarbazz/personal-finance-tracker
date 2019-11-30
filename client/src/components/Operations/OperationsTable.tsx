import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { OperationTableRow } from './OperationsTableRow';
import { State } from '../../store/reducers';
import { useSelector } from 'react-redux';

export const OperationTable: React.FC = () => {
  const operations = useSelector((state: State) => state.operations.operations);

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
          {operations.map(row => (
            <OperationTableRow key={`row${row.id}`} operation={row} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
