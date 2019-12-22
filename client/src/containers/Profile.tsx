import { useSelector } from 'react-redux';
import React from 'react';

import '../styles/Profile.scss';
import { ActionBar } from '../components/ActionBar';
import { logout } from '../components/SideMenu';
import { PwdUpdate } from '../components/Profile/PwdUpdate';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';
import { FNameUpdate } from '../components/Profile/FNameUpdate';
import { updatedFName } from '../store/actions/user';
import { ResetProfile } from '../components/Profile/ResetProfile';

export const updateUserInfo = (
  setMessage: Function,
  toggleLoading: Function,
  userData: { fName?: string; oldPwd?: string; newPwd?: string },
) => {
  return async (dispatch: Function) => {
    toggleLoading(true);
    try {
      const res = await fetch('/api/users/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error && userData.fName) dispatch(updatedFName(userData.fName));
      } else dispatch(logout());
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
};

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName);

  return (
    <div className="page-container">
      <ActionBar />
      <div className="content-container">
        <SectionHeader
          subtitle="Update your info here."
          title={`Welcome back, ${fName}`}
        />
        <div className="inner-content-container">
          <div className="updates-cards-wrapper">
            <PwdUpdate />
            <FNameUpdate />
          </div>
          <ResetProfile />
        </div>
      </div>
    </div>
  );
};
