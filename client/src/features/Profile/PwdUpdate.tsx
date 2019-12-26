import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { GenericBtn } from '../../common/GenericBtn';
import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { updateUserInfo } from './Profile';

export const PwdUpdate: React.FC = () => {
  const dispatch = useDispatch();
  const [isLoading, toggleIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [newPwd, setNewPwd] = useState('');
  const [oldPwd, setOldPwd] = useState('');

  useEffect(() => {
    setMessage({ error: false, value: '' });
  }, [newPwd, oldPwd]);

  return (
    <div className="info-update-card generic-card">
      <h3 className="generic-card-title">Update Password</h3>
      <div className="profile-fields-wrapper">
        <LabelledField
          autoComplete="current-password"
          id="old-password"
          setter={setOldPwd}
          type="password"
          value={oldPwd}
        >
          Old Password
        </LabelledField>
        <LabelledField
          autoComplete="new-password"
          id="new-password"
          setter={setNewPwd}
          type="password"
          value={newPwd}
        >
          New Password
        </LabelledField>
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() =>
            dispatch(
              updateUserInfo(setMessage, toggleIsLoading, { oldPwd, newPwd }),
            )
          }
          isLoading={isLoading}
        >
          Save
          <SaveIcon />
        </GenericBtn>
      </div>
    </div>
  );
};
