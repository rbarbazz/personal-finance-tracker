import { ThemeConfig } from 'react-select/src/theme';
import { useSelector, useDispatch } from 'react-redux';
import React, { useState } from 'react';
import Select, { Styles } from 'react-select';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { colorsByCategory } from '../Analytics/Analytics';
import { getOperations, SelectOption } from './operationsStore';
import { iconsByCategoryTitle } from '../Budget/BudgetCategory';
import { logout } from '../../features/Profile/user';
import { Operation } from '../../../../server/src/db/models';
import { State } from '../../app/rootReducer';
import { UpsertOperationDialog } from './UpsertOperationDialog';

const updateCategory = (categoryId: number, operationId: number) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch(`/api/operations/${operationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId }),
      });
      if (res.status === 200) {
      } else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

const delOperation = (operationId: number) => {
  return async (dispatch: Function) => {
    try {
      const res = await fetch(`/api/operations/${operationId}`, {
        method: 'DELETE',
      });
      if (res.status === 200) dispatch(getOperations());
      else dispatch(logout());
    } catch (error) {
      console.error(error);
    }
  };
};

export const customSelectStyles: Styles = {
  container: provided => ({ ...provided }),
  control: provided => ({ ...provided, padding: 8 }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : '#282828',
  }),
};

export const customSelectTheme: ThemeConfig = theme => ({
  ...theme,
  borderRadius: 0,
  colors: {
    ...theme.colors,
    primary: '#007944',
    primary25: '#e8edf3',
    primary50: '#c1cde0',
  },
});

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

  const handleChange = (selectedOption: any) => {
    setCategory(selectedOption);
    if (selectedOption) dispatch(updateCategory(selectedOption.value, id));
  };

  return (
    <TableRow>
      <TableCell>{dateLocale}</TableCell>
      <TableCell>
        <span className="amount-cell">{amount}</span>
      </TableCell>
      <TableCell>{label}</TableCell>
      <TableCell style={{ minWidth: 200, maxWidth: 200 }}>
        <Select
          formatOptionLabel={({ value, label, parentCategoryTitle }) => {
            const ParentCategoryIcon =
              iconsByCategoryTitle[parentCategoryTitle];

            return (
              <div style={{ alignItems: 'center', display: 'flex' }}>
                {ParentCategoryIcon && (
                  <ParentCategoryIcon
                    style={{
                      fill: colorsByCategory[parentCategoryTitle],
                      height: 22,
                      marginRight: 15,
                      width: 22,
                    }}
                  />
                )}
                <div>{label}</div>
              </div>
            );
          }}
          menuPosition="fixed"
          onChange={handleChange}
          options={categories}
          styles={customSelectStyles}
          theme={customSelectTheme}
          value={selectedCategory}
        />
      </TableCell>
      <TableCell>
        <button
          className="generic-row-action-btn"
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
          className="generic-row-action-btn"
          onClick={() => {
            dispatch(delOperation(id));
          }}
        >
          Delete
        </button>
      </TableCell>
    </TableRow>
  );
};
