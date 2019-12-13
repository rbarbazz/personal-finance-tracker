import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import Select from 'react-select';

import '../../styles/UpsertOperationDialog.scss';
import {
  requestUpsert,
  responseUpsert,
  getOperations,
} from '../../store/actions/operations';
import { GenericBtn } from '../GenericBtn';
import { InfoMessage } from '../InfoMessage';
import { LabelledField } from '../LabelledField';
import { logout } from '../SideMenu';
import { Operation } from '../../../../server/src/db/models';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { SelectOption } from '../../store/reducers/operations';
import { State } from '../../store/reducers/index';

const upsertOperation = (
  initialOperationId = 0,
  isEdit: boolean,
  operation: Partial<Operation>,
  setMessage: Function,
  toggleDialog: Function,
) => {
  return async (dispatch: Function) => {
    dispatch(requestUpsert());
    try {
      const res = await fetch(
        `/operations${isEdit ? `/${initialOperationId}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(operation),
        },
      );
      dispatch(responseUpsert());
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error) {
          toggleDialog(false);
          dispatch(getOperations());
        }
      } else dispatch(logout());
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
};

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

  return (
    <Dialog onClose={() => toggleDialog(false)} open>
      <div className="new-operation-dialog">
        <h3 className="new-operation-title">{`${
          isEdit ? 'Edit' : 'Add'
        } Operation`}</h3>
        <LabelledField
          setter={setDate}
          id="operation-date"
          type="date"
          label="Date"
          value={operationDate}
        />
        <LabelledField
          setter={setAmount}
          id="amount"
          type="number"
          label="Amount"
          value={amount}
        />
        <LabelledField
          setter={setLabel}
          id="label"
          type="text"
          label="Label"
          value={label}
        />
        <label htmlFor="category-select" className="generic-label">
          Category
        </label>
        <Select
          classNamePrefix="category-select"
          id="category-select"
          menuPosition="fixed"
          onChange={selectedOption => {
            setCategory(selectedOption);
          }}
          options={categories}
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
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() => {
            dispatch(
              upsertOperation(
                initialOperation.id,
                isEdit,
                {
                  amount,
                  categoryId: selectedCategory ? selectedCategory.value : 1,
                  label,
                  operationDate,
                },
                setMessage,
                toggleDialog,
              ),
            );
          }}
          id="add-operation-btn"
          isLoading={isMakingUpsert}
          value={['Save', <SaveIcon />]}
        />
      </div>
    </Dialog>
  );
};
