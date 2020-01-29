import { useDispatch } from 'react-redux';
import { useLocation, Link } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import React, { useState, useEffect } from 'react';

import './Login.scss';
import { GenericBtn } from '../../common/GenericBtn';
import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { ReactComponent as EmailIcon } from '../../icons/Email.svg';
import { ReactComponent as LockIcon } from '../../icons/Lock.svg';
import { ReactComponent as LoginIcon } from '../../icons/Login.svg';
import { ReactComponent as PersonIcon } from '../../icons/Person.svg';
import { User } from '../../../../server/src/db/models';
import { userLoggedIn } from '../Profile/user';

export const Login: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [isLoading, toggleLoading] = useState(false);
  const [isRegistered, toggleIsRegistered] = useState(true);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [password, setPassword] = useState('');
  const [registerFName, setregisterFName] = useState('');

  const loginUser = (userData: Partial<User>) => {
    return async (dispatch: Function) => {
      toggleLoading(true);
      try {
        const res = await fetch(
          `/api/auth/${isRegistered ? 'login' : 'register'}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
          },
        );
        toggleLoading(false);
        const {
          error,
          message,
          token,
        }: {
          error: boolean;
          message: string;
          token: string;
        } = await res.json();

        if (res.status === 200) {
          setMessage({ error, value: message });

          if (!isRegistered && !error) toggleIsRegistered(true);
          if (token) {
            const { fName }: { fName: string } = jwtDecode(token);

            return dispatch(userLoggedIn(fName));
          }
        } else if (res.status === 401) {
          setMessage({ error, value: message });
        } else setMessage({ error: true, value: 'An error has occurred' });
      } catch (error) {
        console.error(error);
      }
    };
  };

  useEffect(() => {
    setMessage({ error: false, value: '' });
  }, [email, password, registerFName]);

  useEffect(() => {
    const qs = location.search;
    const params = new URLSearchParams(qs);
    const verif = params.get('verif');
    const reset = params.get('reset');

    if (reset === 'true')
      return setMessage({
        error: false,
        value: 'Password updated, you may now log in',
      });
    if (verif === 'true')
      return setMessage({
        error: false,
        value: 'Account activated, you may now log in',
      });
    else if (verif === 'false') {
      return setMessage({
        error: true,
        value: 'Error validating your email',
      });
    }
  }, [location]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        dispatch(
          loginUser({
            fName: registerFName,
            email,
            password,
          }),
        );
      }}
      className="login-container"
    >
      <p className="greetings-paragraph">Hi stranger!</p>
      {!isRegistered && (
        <LabelledField
          autoComplete="given-name"
          id="fname"
          setter={setregisterFName}
          type="text"
          value={registerFName}
        >
          <PersonIcon />
          First Name
        </LabelledField>
      )}
      <LabelledField
        autoComplete="email"
        id="email"
        setter={setEmail}
        type="email"
        value={email}
      >
        <EmailIcon />
        Email
      </LabelledField>
      <LabelledField
        autoComplete={isRegistered ? 'current-password' : 'new-password'}
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
      <GenericBtn id="login-btn" isLoading={isLoading} type="submit">
        {isRegistered ? 'Login' : 'Sign up'}
        <LoginIcon />
      </GenericBtn>
      <Link className="reset-password-link" to="/lost-password">
        Forgot your password?
      </Link>
      <p className="toggle-registred-paragraph">
        {`${isRegistered ? "Don't" : 'Already'} have an account?`}
        <button
          className="toggle-registered-btn"
          onClick={() => {
            setMessage({ error: false, value: '' });
            toggleIsRegistered(!isRegistered);
          }}
          type="button"
        >
          {`Sign ${isRegistered ? 'up' : 'in'}`}
        </button>
      </p>
    </form>
  );
};
