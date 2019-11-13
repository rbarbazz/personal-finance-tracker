import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Select from 'react-select';

import '../styles/AddOperationDialog.scss';
import { GenericBtn } from '../components/GenericBtn';
import { LabelledField } from './LabelledField';
import { LoadingBars } from './LoadingBars';
import { InfoMessage } from './InfoMessage';

export const AddOperationDialog: React.FC<{
  toggleNewOperation: Function;
  open: boolean;
}> = ({ toggleNewOperation, open }) => {
  const getCategories = async () => {
    try {
      const res = await fetch('/categories', {
        method: 'GET',
      });
      if (res.status === 200) {
        const data = await res.json();

        setCategoryList(
          data.categories.map(({ id, title }: Category) => ({
            value: id,
            label: title,
          })),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const addOperation = async (operation: Operation) => {
    toggleLoading(true);
    try {
      const res = await fetch('/operations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(operation),
      });
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error) {
          toggleNewOperation(false);
        }
      } else {
        setMessage({ error: true, value: 'User is not logged in' });
      }
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
  const [operationDate, setDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState();
  const [categoryList, setCategoryList] = useState([]);
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Dialog onClose={() => toggleNewOperation(false)} open={open}>
      {categoryList.length > 0 ? (
        <div className="new-operation-dialog">
          <h3 className="new-operation-title">New Operation</h3>
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
              addOperation({
                operationDate,
                amount,
                label,
                categoryId: category ? category.value : 0,
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
