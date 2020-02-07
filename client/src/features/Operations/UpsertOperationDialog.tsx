import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import Select from 'react-select';

import './UpsertOperationDialog.scss';
import {
  getOperations,
  requestUpsert,
  responseUpsert,
  SelectOption,
  updateOperationFromState,
} from './operationsStore';
import { colorsByCategory } from '../Analytics/Analytics';
import { customSelectTheme, customSelectStyles } from './OperationsTableRow';
import { GenericBtn } from '../../common/GenericBtn';
import { iconsByCategoryTitle } from '../Budget/BudgetCategory';
import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { logout } from '../../features/Profile/user';
import { Operation } from '../../../../server/src/db/models';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { State } from '../../app/rootReducer';

export const UpsertOperationDialog: React.FC<{
  initialOperation?: Partial<Operation>;
  isEdit?: boolean;
  toggleDialog: Function;
}> = ({
  toggleDialog,
  initialOperation = {
    amount: 0,
    categoryId: 1,
    id: 0,
    label: '',
    operationDate: new Date().toISOString(),
  },
  isEdit = false,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state: State) => state.operations.categories);
  const isMakingUpsert = useSelector(
    (state: State) => state.operations.isMakingUpsert,
  );
  const [operationDate, setDate] = useState(
    new Date(initialOperation.operationDate || '').toISOString().slice(0, 10),
  );
  const [amount, setAmount] = useState(initialOperation.amount);
  const [label, setLabel] = useState(initialOperation.label);
  const [selectedCategory, setCategory] = useState<SelectOption | any>(
    categories.find(category => category.value === initialOperation.categoryId),
  );
  const [message, setMessage] = useState({ error: false, value: '' });

  const upsertOperation = (
    initialOperationId = 0,
    operation: Partial<Operation>,
  ) => {
    return async (dispatch: Function) => {
      dispatch(requestUpsert());
      try {
        const res = await fetch(
          `/api/operations${isEdit ? `/${initialOperationId}` : ''}`,
          {
            method: isEdit ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(operation),
          },
        );
        dispatch(responseUpsert());
        if (res.status === 200) {
          const { error, message } = await res.json();

          setMessage({ error, value: message });
          if (!error) {
            toggleDialog(false);
            if (isEdit)
              dispatch(
                updateOperationFromState({
                  ...operation,
                  id: initialOperationId,
                }),
              );
            else dispatch(getOperations());
          }
        } else dispatch(logout());
      } catch (error) {
        setMessage({ error: true, value: 'An error has occurred' });
      }
    };
  };

  return (
    <Dialog onClose={() => toggleDialog(false)} open>
      <form
        onSubmit={event => {
          event.preventDefault();
          dispatch(
            upsertOperation(initialOperation.id, {
              amount,
              categoryId: selectedCategory ? selectedCategory.value : 1,
              categoryTitle: selectedCategory ? selectedCategory.label : '',
              label,
              operationDate,
            }),
          );
        }}
        className="new-operation-dialog"
      >
        <h3 className="new-operation-title">{`${
          isEdit ? 'Edit' : 'Add'
        } Operation`}</h3>
        <LabelledField
          id="operation-date"
          setter={setDate}
          type="date"
          value={operationDate}
        >
          Date
        </LabelledField>
        <LabelledField
          id="amount"
          setter={setAmount}
          type="number"
          value={amount}
        >
          Amount
        </LabelledField>
        <LabelledField id="label" setter={setLabel} type="text" value={label}>
          Label
        </LabelledField>
        <label htmlFor="category-select" className="generic-label">
          Category
        </label>
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
          inputId="category-select"
          menuPosition="fixed"
          onChange={selectedOption => setCategory(selectedOption)}
          options={categories}
          styles={customSelectStyles}
          theme={customSelectTheme}
          value={selectedCategory}
        />
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          id="add-operation-btn"
          isLoading={isMakingUpsert}
          type="submit"
        >
          Save
          <SaveIcon />
        </GenericBtn>
      </form>
    </Dialog>
  );
};
