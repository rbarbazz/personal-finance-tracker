import { useSelector } from 'react-redux';
import React from 'react';

import '../styles/Profile.scss';
import { ActionBar } from '../components/ActionBar';
import { logout } from '../components/SideMenu';
import { PwdUpdate } from '../components/Profile/PwdUpdate';
import { SectionHeader } from '../components/SectionHeader';
import { State } from '../store/reducers';

export const updateUserInfo = (
  setMessage: Function,
  toggleLoading: Function,
  userData: { oldPwd?: string; newPwd?: string },
) => {
  return async (dispatch: Function) => {
    toggleLoading(true);
    try {
      const res = await fetch('/users/', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error) {
        }
      } else dispatch(logout());
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
};

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName);

  return (
    <div className="profile-container">
      <ActionBar />
      <SectionHeader
        subtitle="Update your info here."
        title={`Welcome back, ${fName}`}
      />
      <div className="profile-content-wrapper">
        <PwdUpdate />
      </div>
    </div>
  );
};
