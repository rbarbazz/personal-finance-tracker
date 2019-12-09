import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';

import '../styles/Login.scss';
import { GenericBtn } from '../components/GenericBtn';
import { InfoMessage } from '../components/InfoMessage';
import { LabelledField } from '../components/LabelledField';
import { ReactComponent as Email } from '../icons/Email.svg';
import { ReactComponent as Lock } from '../icons/Lock.svg';
import { ReactComponent as Person } from '../icons/Person.svg';
import { User } from '../../../server/src/db/models';
import { userLoggedIn } from '../store/actions/user';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, toggleLoading] = useState(false);
  const [isRegistered, toggleIsRegistered] = useState(true);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [password, setPassword] = useState('');
  const [registerFName, setregisterFName] = useState('');

  const loginUser = async (userData: Partial<User>, isRegistered: boolean) => {
    if (!isRegistered) setPassword('');
    toggleLoading(true);
    try {
      const res = await fetch(isRegistered ? '/auth/login' : '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      toggleLoading(false);
      if (res.status === 200) {
        const {
          error,
          message,
          token,
        }: {
          error: boolean;
          message: string;
          token: string;
        } = await res.json();

        setMessage({ error, value: message });

        const { fName }: { fName: string } = jwtDecode(token);

        if (token && fName) {
          return dispatch(userLoggedIn(fName));
        }
      } else setMessage({ error: true, value: 'Wrong Email or Password' });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setMessage({ error: false, value: '' });
  }, [email, password, registerFName]);

  return (
    <div className="login-container">
      <p className="greetings-paragraph">Hi stranger!</p>
      {!isRegistered && (
        <LabelledField
          setter={setregisterFName}
          id="fname"
          type="text"
          label={
            <>
              <Person />
              {'First Name'}
            </>
          }
          value={registerFName}
        />
      )}
      <LabelledField
        setter={setEmail}
        id="email"
        type="email"
        label={
          <>
            <Email />
            {'Email'}
          </>
        }
        value={email}
      />
      <LabelledField
        setter={setPassword}
        id="password"
        type="password"
        label={
          <>
            <Lock />
            {'Password'}
          </>
        }
        value={password}
      />
      {message.value !== '' && (
        <InfoMessage error={message.error} value={message.value} />
      )}
      <GenericBtn
        action={() =>
          loginUser({ fName: registerFName, email, password }, isRegistered)
        }
        id="login-btn"
        isLoading={isLoading}
        value={isRegistered ? 'Login' : 'Sign up'}
      />
      <div className="toggle-registered-container">
        <p className="toggle-registered-paragraph">
          {isRegistered
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            onClick={() => {
              setMessage({ error: false, value: '' });
              toggleIsRegistered(!isRegistered);
            }}
            className="toggle-registered-btn"
          >
            {isRegistered ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
