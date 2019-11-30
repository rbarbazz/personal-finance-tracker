import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import '../styles/Operations.scss';
import { GenericBtn } from '../components/GenericBtn';
import { getOperations, getCategories } from '../store/actions/operations';
import { LoadingBars } from '../components/LoadingBars';
import { OperationTable } from '../components/Operations/OperationsTable';
import { ReactComponent as Add } from '../icons/Add.svg';
import { ReactComponent as FileAdd } from '../icons/FileAdd.svg';
import { State } from '../store/reducers';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { UpsertOperationDialog } from '../components/Operations/UpsertOperationDialog';
import { ActionBar } from '../components/ActionBar';

export const Operations: React.FC = () => {
  const dispatch = useDispatch();
  const isFetchingCategories = useSelector(
    (state: State) => state.operations.isFetchingCategories,
  );
  const isFetchingOperations = useSelector(
    (state: State) => state.operations.isFetchingOperations,
  );
  const operations = useSelector((state: State) => state.operations.operations);
  const [addOperationVisible, toggleAddDialog] = useState(false);
  const [uploadVisible, toggleUpload] = useState(false);

  useEffect(() => {
    if (operations.length < 1) dispatch(getCategories());
    dispatch(getOperations());
  }, [dispatch, operations.length]);

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
      {isFetchingCategories || isFetchingOperations ? (
        <LoadingBars />
      ) : (
        <OperationTable />
      )}
    </div>
  );
};
