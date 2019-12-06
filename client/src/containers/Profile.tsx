import { useSelector } from 'react-redux';
import React from 'react';

import '../styles/Profile.scss';
import { ActionBar } from '../components/ActionBar';
import { State } from '../store/reducers';
import { SectionHeader } from '../components/SectionHeader';

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName);

  return (
    <div className="profile-container">
      <ActionBar />
      <SectionHeader
        subtitle="Soon you will be able to update your info here."
        title={`Welcome back, ${fName}`}
      />
    </div>
  );
};
