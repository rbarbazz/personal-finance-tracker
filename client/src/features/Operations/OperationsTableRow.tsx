import { ThemeConfig } from 'react-select/src/theme'
import { useSelector, useDispatch } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'
import React, { useState, useEffect } from 'react'
import Select, { Styles } from 'react-select'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import {
  SelectOption,
  updateOperationCategory,
  delOperation,
} from './operationsStore'
import { colorsByCategory } from '../Analytics/Analytics'
import { iconsByCategoryTitle } from '../Budget/BudgetCategory'
import { Operation } from '../../../../server/src/db/models'
import { State } from '../../app/rootReducer'
import { UpsertOperationDialog } from './UpsertOperationDialog'

export const customSelectStyles: Styles = {
  container: (provided) => ({ ...provided }),
  control: (provided) => ({ ...provided, padding: 8 }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : '#282828',
  }),
}

export const customSelectTheme: ThemeConfig = (theme) => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary: '#007944',
    primary25: '#e8edf3',
    primary50: '#c1cde0',
  },
})

export const OperationTableRow: React.FC<{
  operation: Operation
}> = ({ operation }) => {
  const { id, operationDate, amount, label, categoryId } = operation
  const dateLocale = new Date(operationDate).toISOString().substring(0, 10)
  const dispatch = useDispatch()
  const categories = useSelector((state: State) => state.operations.categories)
  const [editOperationVisible, toggleEditDialog] = useState(false)
  const [selectedCategory, setCategory] = useState<SelectOption | any>(
    categories.find((category) => category.value === categoryId),
  )
  const categoryColor = selectedCategory
    ? colorsByCategory[selectedCategory.parentCategoryTitle]
    : 'white'
  const StyledTableCell = withStyles({
    root: {
      borderLeftWidth: 12,
      borderLeftStyle: 'solid',
      borderLeftColor: categoryColor,
    },
  })(TableCell)

  const handleChange = (selectedOption: any) => {
    setCategory(selectedOption)
    if (selectedOption)
      dispatch(updateOperationCategory(selectedOption.value, id))
  }

  useEffect(() => {
    setCategory(categories.find((category) => category.value === categoryId))
  }, [operation, categories, categoryId])

  return (
    <TableRow>
      <StyledTableCell>{dateLocale}</StyledTableCell>
      <TableCell>
        <span className="amount-cell">{amount}</span>
      </TableCell>
      <TableCell style={{ maxWidth: 200 }}>{label}</TableCell>
      <TableCell
        className="hidden-on-mobile"
        style={{ minWidth: 200, maxWidth: 200 }}
      >
        <Select
          formatOptionLabel={({ label, parentCategoryTitle }) => {
            const ParentCategoryIcon = iconsByCategoryTitle[parentCategoryTitle]

            return (
              <div style={{ alignItems: 'center', display: 'flex' }}>
                {ParentCategoryIcon && (
                  <ParentCategoryIcon
                    style={{
                      fill: colorsByCategory[parentCategoryTitle],
                      height: 22,
                      marginRight: 15,
                      minWidth: 22,
                    }}
                  />
                )}
                <div style={{ overflow: 'hidden' }}>{label}</div>
              </div>
            )
          }}
          menuPosition="fixed"
          onChange={handleChange}
          options={categories}
          styles={customSelectStyles}
          theme={customSelectTheme}
          value={selectedCategory}
        />
      </TableCell>
      <TableCell className="hidden-on-mobile">
        <button
          className="generic-row-action-btn"
          onClick={() => toggleEditDialog(true)}
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
          onClick={() => dispatch(delOperation(id))}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  )
}
