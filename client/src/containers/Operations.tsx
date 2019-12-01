import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import '../styles/Operations.scss';
import { ActionBar } from '../components/ActionBar';
import { GenericBtn } from '../components/GenericBtn';
import { getOperations, getCategories } from '../store/actions/operations';
import { LoadingBars } from '../components/LoadingBars';
import { OperationTable } from '../components/Operations/OperationsTable';
import { ReactComponent as Add } from '../icons/Add.svg';
import { ReactComponent as FileAdd } from '../icons/FileAdd.svg';
import { State } from '../store/reducers';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { UpsertOperationDialog } from '../components/Operations/UpsertOperationDialog';

export const Operations: React.FC = () => {
  const dispatch = useDispatch();
  const getInitialOperations = useCallback(() => {
    dispatch(getCategories());
    dispatch(getOperations());
  }, [dispatch]);
  const isFetchingCategories = useSelector(
    (state: State) => state.operations.isFetchingCategories,
  );
  const isFetchingOperations = useSelector(
    (state: State) => state.operations.isFetchingOperations,
  );
  const [addOperationVisible, toggleAddDialog] = useState(false);
  const [uploadVisible, toggleUpload] = useState(false);

  useEffect(() => {
    getInitialOperations();
  }, [getInitialOperations]);

  return (
    <div className="operations-container">
      <ActionBar>
        <GenericBtn
          action={() => toggleUpload(true)}
          value={
            <>
              {'Upload file'}
              <FileAdd />
            </>
          }
        />
        {uploadVisible && <UploadDialog toggleUpload={toggleUpload} />}
        <GenericBtn
          action={() => toggleAddDialog(true)}
          value={
            <>
              {'Add Operation'}
              <Add />
            </>
          }
        />
        {addOperationVisible && (
          <UpsertOperationDialog toggleDialog={toggleAddDialog} />
        )}
      </ActionBar>
      <h2 className="section-title">Operations</h2>
      <p className="section-subtitle">Update and import operations</p>
      <div className="table-container">
        {isFetchingCategories || isFetchingOperations ? (
          <LoadingBars />
        ) : (
          <OperationTable />
        )}
      </div>
    </div>
  );
};
