import React, { useState, useEffect } from 'react';

import '../styles/Operations.scss';
import { SideMenu } from '../components/SideMenu';
import { GenericBtn } from '../components/GenericBtn';
import { UpsertOperationDialog } from '../components/Operations/UpsertOperationDialog';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { OperationRow } from '../../../server/src/db/models';
import { OperationTable } from '../components/Operations/OperationsTable';

export const Operations: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [addOperationVisible, toggleAddDialog] = useState(false);
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
  }, [uploadVisible]);

  return (
    <div className="main-container">
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="operations-container">
        <div className="action-buttons-container">
          <GenericBtn action={() => toggleUpload(true)} value="Upload CSV" />
          {uploadVisible && <UploadDialog toggleUpload={toggleUpload} />}
          <GenericBtn action={() => toggleAddDialog(true)} value="Add Operation" />
          {addOperationVisible && (
            <UpsertOperationDialog
              toggleDialog={toggleAddDialog}
              getOperations={getOperations}
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
