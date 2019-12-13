import React, { useState } from 'react';

import '../styles/LabelledField.scss';
import { ReactComponent as EyeIcon } from '../icons/Eye.svg';
import { ReactComponent as EyeOffIcon } from '../icons/EyeOff.svg';

export const LabelledField: React.FC<{
  autoComplete?: string;
  disabled?: boolean;
  id?: string;
  setter: Function;
  type: string;
  value: any;
}> = ({
  autoComplete,
  children,
  disabled = false,
  id,
  setter,
  type: initialType,
  value,
}) => {
  const [isPwdVisible, toggleVisibility] = useState(false);

  return (
    <div className="labelled-field">
      <label className="generic-label" htmlFor={`${id}-field`}>
        <div style={{ display: 'flex' }}>{children}</div>
        {initialType === 'password' && (
          <div
            className="password-toggler"
            onClick={() => toggleVisibility(prev => !prev)}
          >
            {value !== '' &&
              (isPwdVisible ? (
                <>
                  Hide
                  <EyeOffIcon />
                </>
              ) : (
                <>
                  Show
                  <EyeIcon />
                </>
              ))}
          </div>
        )}
      </label>
      <div className="label-input-wrapper">
        <input
          {...(autoComplete ? { autoComplete: autoComplete } : {})}
          className="generic-input"
          disabled={disabled}
          {...(id ? { id: `${id}-field` } : {})}
          onChange={event => setter(event.target.value)}
          type={
            initialType === 'password' && isPwdVisible ? 'text' : initialType
          }
          value={value}
        />
      </div>
    </div>
  );
};
