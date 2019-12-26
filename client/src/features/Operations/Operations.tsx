import { CSVLink } from 'react-csv';
import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect, useCallback } from 'react';

import './Operations.scss';
import { ActionBar } from '../../common/ActionBar';
import { GenericBtn } from '../../common/GenericBtn';
import { getOperations, getCategories } from './operations';
import { OperationTable } from './OperationsTable';
import { ReactComponent as AddIcon } from '../../icons/Add.svg';
import { ReactComponent as ArchiveIcon } from '../../icons/Archive.svg';
import { ReactComponent as FileAddIcon } from '../../icons/FileAdd.svg';
import { SectionHeader } from '../../common/SectionHeader';
import { State } from '../../app/rootReducer';
import { UploadDialog } from './UploadDialog';
import { UpsertOperationDialog } from './UpsertOperationDialog';

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
  const csvData = operations.map(operation => {
    const { amount, categoryTitle, label, operationDate } = operation;

    return {
      amount,
      categoryTitle,
      label,
      operationDate: new Date(operationDate).toISOString().substring(0, 10),
    };
  });

  useEffect(() => {
    getInitialOperations();
  }, [getInitialOperations]);

  return (
    <div className="page-container">
      <ActionBar>
        <GenericBtn action={() => toggleAddDialog(true)}>
          Add
          <AddIcon />
        </GenericBtn>
        <GenericBtn action={() => toggleUpload(true)}>
          Import
          <FileAddIcon />
        </GenericBtn>
        {uploadVisible && <UploadDialog toggleUpload={toggleUpload} />}
        <CSVLink
          data={csvData}
          filename="operations-export.csv"
          separator=";"
          target="_blank"
        >
          <GenericBtn action={() => {}}>
            Export
            <ArchiveIcon />
          </GenericBtn>
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
        <OperationTable
          isLoading={isFetchingCategories || isFetchingOperations}
          operations={operations}
        />
      </div>
    </div>
  );
};
