import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import '../styles/Operations.scss';
import { ActionBar } from '../components/ActionBar';
import { CardErrorMessage } from '../components/CardErrorMessage';
import { GenericBtn } from '../components/GenericBtn';
import { getOperations, getCategories } from '../store/actions/operations';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { OperationTable } from '../components/Operations/OperationsTable';
import { ReactComponent as AddIcon } from '../icons/Add.svg';
import { ReactComponent as ArchiveIcon } from '../icons/Archive.svg';
import { ReactComponent as FileAddIcon } from '../icons/FileAdd.svg';
import { SectionHeader } from '../components/SectionHeader';
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
  const operations = useSelector((state: State) => state.operations.operations);
  const [addOperationVisible, toggleAddDialog] = useState(false);
  const [uploadVisible, toggleUpload] = useState(false);

  useEffect(() => {
    getInitialOperations();
  }, [getInitialOperations]);

  return (
    <div className="operations-container">
      <ActionBar>
        <GenericBtn
          action={() => toggleAddDialog(true)}
          value={
            <>
              {'Add'}
              <AddIcon />
            </>
          }
        />
        <GenericBtn
          action={() => toggleUpload(true)}
          value={
            <>
              {'Import'}
              <FileAddIcon />
            </>
          }
        />
        {uploadVisible && <UploadDialog toggleUpload={toggleUpload} />}
        <CSVLink
          data={operations.map(operation => {
            const { amount, categoryTitle, label, operationDate } = operation;

            return {
              amount,
              categoryTitle,
              label,
              operationDate: new Date(operationDate)
                .toISOString()
                .substring(0, 10),
            };
          })}
          filename="operations-export.csv"
          separator=";"
          target="_blank"
        >
          <GenericBtn
            action={() => {}}
            value={
              <>
                {'Export'}
                <ArchiveIcon />
              </>
            }
          />
        </CSVLink>
        {addOperationVisible && (
          <UpsertOperationDialog toggleDialog={toggleAddDialog} />
        )}
      </ActionBar>
      <SectionHeader
        subtitle="Add, edit and delete operations."
        title="Operations"
      />
      <div className="table-container">
        {isFetchingCategories || isFetchingOperations ? (
          <LoadingSpinner />
        ) : operations.length < 1 ? (
          <CardErrorMessage message="Please import more transactions before you can see this table" />
        ) : (
          <OperationTable />
        )}
      </div>
    </div>
  );
};
