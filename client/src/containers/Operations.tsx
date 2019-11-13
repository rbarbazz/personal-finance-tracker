import React, { useState } from 'react';

import '../styles/Operations.scss';
import { SideMenu } from '../components/SideMenu';
import { GenericBtn } from '../components/GenericBtn';
import { AddOperationDialog } from '../components/AddOperationDialog';

export const Operations: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [newOperationVisible, toggleNewOperation] = useState(false);

  return (
    <div className="main-container">
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="operations-container">
        <div className="action-buttons-container">
          <GenericBtn action={() => {}} value="Upload CSV" />
          <GenericBtn
            action={() => toggleNewOperation(!newOperationVisible)}
            value="Add Operation"
          />
        </div>
        {newOperationVisible && (
          <AddOperationDialog
            toggleNewOperation={toggleNewOperation}
            open={true}
          />
        )}
      </div>
    </div>
  );
};
