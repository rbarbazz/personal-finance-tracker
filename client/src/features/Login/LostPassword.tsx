import { Link, useLocation, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import './LostPassword.scss';
import { GenericBtn } from '../../common/GenericBtn';
import { InfoMessage } from '../../common/InfoMessage';
import { LabelledField } from '../../common/LabelledField';
import { ReactComponent as EmailIcon } from '../../icons/Email.svg';
import { ReactComponent as LockIcon } from '../../icons/Lock.svg';

export const LostPassword: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const resetPassword = async (email: string) => {
    if (email.length === 0)
      return setMessage({
        error: true,
        value: 'Please provide an email',
      });
    toggleLoading(true);
    try {
      const res = await fetch(`/api/auth/reset-password?email=${email}`, {
        method: 'GET',
      });
      toggleLoading(false);
      const {
        error,
        message,
      }: {
        error: boolean;
        message: string;
      } = await res.json();

      if (res.status === 200) {
        setMessage({ error, value: message });
      } else setMessage({ error: true, value: 'An error has occurred' });
    } catch (error) {
      console.error(error);
    }
  };

  const updatePassword = async (password: string) => {
    toggleLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });
      toggleLoading(false);
      const {
        error,
        message,
      }: {
        error: boolean;
        message: string;
      } = await res.json();

      if (res.status === 200) {
        setMessage({ error, value: message });

        if (!error) history.push('/?reset=true');
      } else setMessage({ error: true, value: 'An error has occurred' });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const qs = location.search;
    const params = new URLSearchParams(qs);
    const token = params.get('token');

    if (token) setToken(token);
  }, [location]);

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        token.length < 1 ? resetPassword(email) : updatePassword(password);
      }}
      className="reset-password-container"
    >
      <p className="greetings-paragraph">Lost password?</p>
      {token.length < 1 ? (
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
      ) : (
        <LabelledField
          autoComplete={'new-password'}
          id="password"
          setter={setPassword}
          type="password"
          value={password}
        >
          <LockIcon />
          New Password
        </LabelledField>
      )}
      {message.value !== '' && (
        <InfoMessage error={message.error} value={message.value} />
      )}
      <GenericBtn id="reset-password-btn" isLoading={isLoading} type="submit">
        {token.length < 1 ? 'Reset' : 'Send'}
      </GenericBtn>
      <Link className="back-home-link" to="/">
        Return to the homepage
      </Link>
    </form>
  );
};
