import React from 'react';

import '../styles/LabelledField.scss';

export const LabelledField: React.FC<{
  setter: Function;
  id: string;
  label: string | React.ReactChild;
  type: string;
  value: any;
}> = ({ setter, id, label, type, value }) => (
  <div className="labelled-field">
    <label className="generic-label" htmlFor={`${id}-field`}>
      {label}
    </label>
    <input
      onChange={event => setter(event.target.value)}
      type={type}
      id={`${id}-field`}
      className="generic-input"
      value={value}
    />
  </div>
);
