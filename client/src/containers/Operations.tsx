import React, { useState, useEffect } from 'react';

import '../styles/Operations.scss';
import { SideMenu } from '../components/SideMenu';
import { GenericBtn } from '../components/GenericBtn';
import { AddOperationDialog } from '../components/Operations/AddOperationDialog';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { OperationRow } from '../../../server/models.d';
import { OperationTable } from '../components/Operations/OperationsTable';

export const Operations: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [newOperationVisible, toggleNewOperation] = useState(false);
  const [uploadVisible, toggleUpload] = useState(false);
  const [operationList, setOperationList] = useState<OperationRow[]>([]);
  const getOperations = async () => {
    try {
      const res = await fetch('/operations', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { operations }: { operations: OperationRow[] } = await res.json();

        setOperationList(operations);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getOperations();
  }, [newOperationVisible, uploadVisible]);

  return (
    <div className="main-container">
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="operations-container">
        <div className="action-buttons-container">
          <GenericBtn action={() => toggleUpload(true)} value="Upload CSV" />
          {uploadVisible && (
            <UploadDialog toggleUpload={toggleUpload} open={true} />
          )}
          <GenericBtn
            action={() => toggleNewOperation(true)}
            value="Add Operation"
          />
          {newOperationVisible && (
            <AddOperationDialog
              toggleNewOperation={toggleNewOperation}
              open={true}
            />
          )}
        </div>
        {operationList.length > 0 && (
          <OperationTable
            operationList={operationList}
            getOperations={getOperations}
          />
        )}
      </div>
    </div>
  );
};
