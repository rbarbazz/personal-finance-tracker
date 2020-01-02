import '@testing-library/jest-dom/extend-expect';
import { fireEvent } from '@testing-library/react';
import React from 'react';

import { SideMenu } from './SideMenu';
import { renderWithRedux } from '../setupTests';
import * as userStore from '../features/Profile/user';

test('Logs out on click', () => {
  const mockLogout = jest.spyOn(userStore, 'logout');

  const { getByText } = renderWithRedux(<SideMenu />);

  fireEvent.click(getByText(/logout\.svg/i));

  expect(mockLogout).toHaveBeenCalledTimes(1);
});
