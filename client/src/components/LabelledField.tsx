import React from 'react';

import '../styles/LabelledField.scss';

export const LabelledField: React.FC<{
  disabled?: boolean;
  id?: string;
  label?: string | React.ReactChild;
  setter: Function;
  type: string;
  value: any;
}> = ({ disabled = false, setter, id, label, type, value }) => (
  <div className="labelled-field">
    {label && (
      <label className="generic-label" htmlFor={`${id}-field`}>
        {label}
      </label>
    )}
    <input
      className="generic-input"
      disabled={disabled}
      id={id ? `${id}-field` : ''}
      onChange={event => setter(event.target.value)}
      type={type}
      value={value}
    />
  </div>
);
