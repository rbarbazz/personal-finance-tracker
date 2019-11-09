import React, { useState } from 'react';

import '../styles/Login.scss';

export const Login: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [isRegistered, toggleIsRegistered] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verifPassword, setVerifPassword] = useState('');

  return (
    <div className="login-container">
      <p className="greetings-paragraph">Hi stranger!</p>
      <input
        onChange={event => setEmail(event.target.value)}
        type="email"
        className="email-field"
        value={email}
      />
      <input
        onChange={event => setPassword(event.target.value)}
        type="password"
        className="password-field"
        value={password}
      />
      {!isRegistered && (
        <input
          onChange={event => setVerifPassword(event.target.value)}
          type="password"
          className="retype-password-field"
          value={verifPassword}
        />
      )}
      <button
        onClick={() =>
          toggleIsLoggedIn((currentState: boolean) => !currentState)
        }
      >
        {isRegistered ? 'Login' : 'Sign up'}
      </button>
      <div className="toggle-registred-container">
        <p className="toggle-registred-paragraph">
          {isRegistered ? "Don' have an account? " : 'Already have an account? '}
          <a
            onClick={() => toggleIsRegistered(!isRegistered)}
            className="toggle-registred-btn"
          >
            {isRegistered ? 'Sign up' : 'Sign in'}
          </a>
        </p>
      </div>
    </div>
  );
};
