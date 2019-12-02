import { useSelector } from 'react-redux';
import React from 'react';

import '../styles/Profile.scss';
import { ActionBar } from '../components/ActionBar';
import { State } from '../store/reducers';

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName);

  return (
    <div className="profile-container">
      <ActionBar />
      <h2 className="section-title">{`Welcome back, ${fName}`}</h2>
      <p className="section-subtitle">
        Soon you will be able to update your info here
      </p>
    </div>
  );
};
