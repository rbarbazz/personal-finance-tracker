import Dialog from '@material-ui/core/Dialog';
import React, { useState } from 'react';
import Select, { OptionTypeBase } from 'react-select';

import '../../styles/UpsertOperationDialog.scss';
import { Operation, OperationDB } from '../../../../server/src/db/models';
import { GenericBtn } from '../GenericBtn';
import { InfoMessage } from '../InfoMessage';
import { LabelledField } from '../LabelledField';
import { LoadingBars } from '../LoadingBars';

export const UpsertOperationDialog: React.FC<{
  categoryList: OptionTypeBase[];
  getOperations: Function;
  initialOperation?: OperationDB;
  isEdit?: boolean;
  toggleDialog: Function;
}> = ({
  categoryList,
  toggleDialog,
  initialOperation = {
    amount: 0,
    categoryId: 1,
    id: 0,
    label: '',
    operationDate: new Date().toISOString(),
  },
  isEdit = false,
  getOperations,
}) => {
  const [operationDate, setDate] = useState(
    new Date(initialOperation.operationDate).toISOString().slice(0, 10),
  );
  const [amount, setAmount] = useState(initialOperation.amount);
  const [label, setLabel] = useState(initialOperation.label);
  const [category, setCategory] = useState<OptionTypeBase>(
    categoryList.find(elem => elem.value === initialOperation.categoryId) || {
      value: initialOperation.categoryId,
    },
  );
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const upsertOperation = async (operation: Operation) => {
    toggleLoading(true);
    try {
      const res = await fetch(
        `/operations${isEdit ? `/${initialOperation.id}` : ''}`,
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(operation),
        },
      );
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error) {
          toggleDialog(false);
          getOperations();
        }
      } else {
        setMessage({ error: true, value: 'User is not logged in' });
      }
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };

  return (
    <Dialog onClose={() => toggleDialog(false)} open>
      {categoryList.length > 0 ? (
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
            options={categoryList}
            theme={theme => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary: '#007944',
              },
            })}
            value={category}
          />
          {message.value !== '' && (
            <InfoMessage error={message.error} value={message.value} />
          )}
          <GenericBtn
            action={() => {
              upsertOperation({
                amount,
                categoryId: category ? category.value : 1,
                label,
                operationDate,
              });
            }}
            id="add-operation-btn"
            isLoading={isLoading}
            value="Save"
          />
        </div>
      ) : (
        <LoadingBars />
      )}
    </Dialog>
  );
};
