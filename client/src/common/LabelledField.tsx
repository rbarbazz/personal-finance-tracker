import React, { useState } from 'react';

import './LabelledField.scss';
import { ReactComponent as EyeIcon } from '../icons/Eye.svg';
import { ReactComponent as EyeOffIcon } from '../icons/EyeOff.svg';

export const LabelledField: React.FC<{
  autoComplete?: string;
  disabled?: boolean;
  id?: string;
  max?: number;
  min?: number;
  step?: number;
  setter: Function;
  type: string;
  value: any;
}> = ({
  autoComplete,
  children,
  disabled = false,
  id,
  max,
  min,
  step,
  setter,
  type: initialType,
  value,
}) => {
  const [isPwdVisible, toggleVisibility] = useState(false);

  return (
    <div className="labelled-field">
      {children && (
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
      )}
      <div className="label-input-wrapper">
        <input
          {...(autoComplete ? { autoComplete } : {})}
          className="generic-input"
          disabled={disabled}
          {...(id ? { id: `${id}-field` } : {})}
          {...(max !== undefined ? { max } : {})}
          {...(min !== undefined ? { min } : {})}
          {...(step ? { step } : {})}
          onChange={event => {
            if (initialType === 'number') {
              const valAsNum = event.target.valueAsNumber;

              return isNaN(valAsNum) ? setter(0) : setter(valAsNum);
            }
            return setter(event.target.value);
          }}
          type={
            initialType === 'password' && isPwdVisible ? 'text' : initialType
          }
          value={value}
        />
      </div>
    </div>
  );
};
