import { useSelector } from 'react-redux';
import React from 'react';

import '../styles/Profile.scss';
import { ActionBar } from '../components/ActionBar';
import { GenericBtn } from '../components/GenericBtn';
import { LabelledField } from '../components/LabelledField';
import { ReactComponent as SaveIcon } from '../icons/Save.svg';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName);

  return (
    <div className="profile-container">
      <ActionBar />
      <SectionHeader
        subtitle="Soon you will be able to update your info here."
        title={`Welcome back, ${fName}`}
      />
      <div className="password-update-container generic-card">
        <h3 className="generic-card-title">Update Password</h3>
        <div className="profile-fields-wrapper">
          <LabelledField
            autoComplete="current-password"
            id="old-password"
            label="Old Password"
            setter={() => {}}
            type="password"
            value=""
          />
          <LabelledField
            autoComplete="new-password"
            id="new-password"
            label="New Password"
            setter={() => {}}
            type="password"
            value=""
          />
          <GenericBtn action={() => {}} value={['Save', <SaveIcon />]} />
        </div>
      </div>
    </div>
  );
};
