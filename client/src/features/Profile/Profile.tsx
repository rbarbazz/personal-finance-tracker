import { useSelector } from 'react-redux'
import React from 'react'

import './Profile.scss'
import { ActionBar } from '../../common/ActionBar'
import { FNameUpdate } from './FNameUpdate'
import { logout } from '../../features/Profile/user'
import { PwdUpdate } from './PwdUpdate'
import { ResetProfile } from './ResetProfile'
import { SectionHeader } from '../../common/SectionHeader'
import { State } from '../../app/rootReducer'
import { updatedFName } from './user'

export const updateUserInfo = (
  setMessage: Function,
  toggleLoading: Function,
  userData: { fName?: string; oldPwd?: string; newPwd?: string },
) => {
  return async (dispatch: Function) => {
    toggleLoading(true)
    try {
      const res = await fetch('/api/users/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })
      toggleLoading(false)
      if (res.status === 200) {
        const { error, message } = await res.json()

        setMessage({ error, value: message })
        if (!error && userData.fName) dispatch(updatedFName(userData.fName))
      } else dispatch(logout())
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' })
    }
  }
}

export const Profile: React.FC = () => {
  const fName = useSelector((state: State) => state.user.fName)

  return (
    <div className="page-container">
      <ActionBar />
      <div className="content-container">
        <SectionHeader
          subtitle="Update your info here."
          title={`Welcome back, ${fName}`}
        />
        <div className="inner-content-container" id="profile-container">
          <PwdUpdate />
          <FNameUpdate />
          <ResetProfile />
        </div>
      </div>
    </div>
  )
}
