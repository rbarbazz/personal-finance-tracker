import { withStyles } from '@material-ui/core/styles'
import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { CardErrorMessage } from '../../common/CardErrorMessage'
import { LoadingSpinner } from '../../common/LoadingSpinner'
import { Operation } from '../../../../server/src/db/models'
import { OperationTableRow } from './OperationsTableRow'

const StyledTableCell = withStyles({
  root: {
    borderLeftWidth: 12,
    borderLeftStyle: 'solid',
    borderLeftColor: 'white',
  },
})(TableCell)

export const OperationTable: React.FC<{
  isLoading: boolean
  operations: Operation[]
}> = ({ isLoading, operations }) => {
  if (isLoading) return <LoadingSpinner />

  if (operations.length < 1)
    return (
      <CardErrorMessage message="Please import more transactions before you can see this table" />
    )

  return (
    <Table aria-label="simple table">
      <TableHead>
        <TableRow>
          <StyledTableCell>Date</StyledTableCell>
          <TableCell>Amount</TableCell>
          <TableCell>Label</TableCell>
          <TableCell className="hidden-on-mobile">Category</TableCell>
          <TableCell className="hidden-on-mobile">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {operations.map((row) => (
          <OperationTableRow key={`row${row.id}`} operation={row} />
        ))}
      </TableBody>
    </Table>
  )
}
