import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';

import '../styles/Login.scss';
import { GenericBtn } from '../components/GenericBtn';
import { InfoMessage } from '../components/InfoMessage';
import { LabelledField } from '../components/LabelledField';
import { ReactComponent as EmailIcon } from '../icons/Email.svg';
import { ReactComponent as LockIcon } from '../icons/Lock.svg';
import { ReactComponent as LoginIcon } from '../icons/Login.svg';
import { ReactComponent as PersonIcon } from '../icons/Person.svg';
import { User } from '../../../server/src/db/models';
import { userLoggedIn } from '../store/actions/user';

const loginUser = (
  isRegistered: boolean,
  setMessage: Function,
  toggleLoading: Function,
  userData: Partial<User>,
) => {
  return async (dispatch: Function) => {
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
};

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, toggleLoading] = useState(false);
  const [isRegistered, toggleIsRegistered] = useState(true);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [password, setPassword] = useState('');
  const [registerFName, setregisterFName] = useState('');

  useEffect(() => {
    setMessage({ error: false, value: '' });
  }, [email, password, registerFName]);

  return (
    <div className="login-container">
      <p className="greetings-paragraph">Hi stranger!</p>
      {!isRegistered && (
        <LabelledField
          id="fname"
          setter={setregisterFName}
          type="text"
          value={registerFName}
        >
          <PersonIcon />
          First Name
        </LabelledField>
      )}
      <LabelledField id="email" setter={setEmail} type="email" value={email}>
        <EmailIcon />
        Email
      </LabelledField>
      <LabelledField
        id="password"
        setter={setPassword}
        type="password"
        value={password}
      >
        <LockIcon />
        Password
      </LabelledField>
      {message.value !== '' && (
        <InfoMessage error={message.error} value={message.value} />
      )}
      <GenericBtn
        action={() =>
          dispatch(
            loginUser(isRegistered, setMessage, toggleLoading, {
              fName: registerFName,
              email,
              password,
            }),
          )
        }
        id="login-btn"
        isLoading={isLoading}
      >
        {isRegistered ? 'Login' : 'Sign up'}
        <LoginIcon />
      </GenericBtn>
      <div className="toggle-registered-container">
        <p className="toggle-registered-paragraph">
          {`${isRegistered ? "Don't" : 'Already'} have an account?`}
          <button
            className="toggle-registered-btn"
            onClick={() => {
              setMessage({ error: false, value: '' });
              toggleIsRegistered(!isRegistered);
            }}
          >
            {`Sign ${isRegistered ? 'up' : 'in'}`}
          </button>
        </p>
      </div>
    </div>
  );
};
