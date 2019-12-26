import { useDispatch } from 'react-redux';
import React, { useState, useEffect } from 'react';

import { GenericBtn } from '../../common/GenericBtn';
import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { ReactComponent as SaveIcon } from '../../icons/Save.svg';
import { updateUserInfo } from './Profile';

export const FNameUpdate: React.FC = () => {
  const dispatch = useDispatch();
  const [fName, setFName] = useState('');
  const [isLoading, toggleIsLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });

  useEffect(() => {
    setMessage({ error: false, value: '' });
  }, [fName]);

  return (
    <div className="info-update-card generic-card" id="fname-update-card">
      <h3 className="generic-card-title">Update First Name</h3>
      <div className="profile-fields-wrapper">
        <LabelledField
          id="new-fname"
          setter={setFName}
          type="text"
          value={fName}
        >
          First Name
        </LabelledField>
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() =>
            dispatch(updateUserInfo(setMessage, toggleIsLoading, { fName }))
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
