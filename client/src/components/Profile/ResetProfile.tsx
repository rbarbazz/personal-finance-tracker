import { useDispatch } from 'react-redux';
import React, { useState } from 'react';

import { GenericBtn } from '../GenericBtn';
import { InfoMessage } from '../InfoMessage';
import { logout } from '../SideMenu';
import { ReactComponent as ResetIcon } from '../../icons/Reset.svg';

const resetProfile = (setMessage: Function, toggleLoading: Function) => {
  return async (dispatch: Function) => {
    toggleLoading(true);
    try {
      const res = await fetch('/users/', {
        method: 'DELETE',
      });
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
      } else dispatch(logout());
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
};

export const ResetProfile: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, toggleIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });

  return (
    <div className="info-update-card generic-card" id="reset-profile-card">
      <h3 className="generic-card-title">Danger Zone</h3>
      <div className="profile-fields-wrapper">
        <p className="reset-explanations">
          This action will remove all <strong>transactions</strong> and{' '}
          <strong>budgets</strong> associated with your account.
        </p>
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() => dispatch(resetProfile(setMessage, toggleIsLoading))}
          isLoading={isLoading}
        >
          Reset Profile
          <ResetIcon />
        </GenericBtn>
      </div>
    </div>
  );
};
