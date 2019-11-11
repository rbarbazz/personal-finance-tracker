import React, { useState } from 'react';

import '../styles/Login.scss';
import { GenericBtn } from '../components/GenericBtn';
import { LabelledField } from '../components/LabelledField';

export const Login: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [isRegistered, toggleIsRegistered] = useState(true);
  const [email, setEmail] = useState('');
  const [fName, setFName] = useState('');
  const [password, setPassword] = useState('');
  const loginUser = async (userData: User, isRegistered: boolean) => {
    try {
      const res = await fetch(isRegistered ? '/login' : '/register', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      if (res.status === 200) {
        const { error, message } = await res.json();
        if (!error) toggleIsLoggedIn(true);
        else console.error(message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <p className="greetings-paragraph">Hi stranger!</p>
      {!isRegistered && (
        <LabelledField
          setter={setFName}
          id="fname"
          type="text"
          label="First Name"
          value={fName}
        />
      )}
      <LabelledField
        setter={setEmail}
        id="email"
        type="email"
        label="Email"
        value={email}
      />
      <LabelledField
        setter={setPassword}
        id="password"
        type="password"
        label="Password"
        value={password}
      />
      <GenericBtn
        action={() => loginUser({ fName, email, password }, isRegistered)}
        id="login-btn"
        value={isRegistered ? 'Login' : 'Sign up'}
      />
      <div className="toggle-registered-container">
        <p className="toggle-registered-paragraph">
          {isRegistered
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button
            onClick={() => toggleIsRegistered(!isRegistered)}
            className="toggle-registered-btn"
          >
            {isRegistered ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};
