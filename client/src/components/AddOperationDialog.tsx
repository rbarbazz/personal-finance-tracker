import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import Select, { ValueType } from 'react-select';

import '../styles/AddOperationDialog.scss';
import { GenericBtn } from '../components/GenericBtn';
import { LabelledField } from './LabelledField';

export const AddOperationDialog: React.FC<{
  toggleNewOperation: Function;
  open: boolean;
}> = ({ toggleNewOperation, open }) => {
  const categories = [
    { value: 0, label: 'Food' },
    { value: 1, label: 'Clothing' },
  ];
  const [operationDate, setDate] = useState('');
  const [amount, setAmount] = useState(0);
  const [label, setLabel] = useState('');
  const [category, setCategory] = useState();

  return (
    <Dialog onClose={() => toggleNewOperation(false)} open={open}>
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
          options={categories}
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
        <GenericBtn action={() => {}} value="Save" />
      </div>
    </Dialog>
  );
};
