import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

import '../styles/Operations.scss';
import { Category } from '../../../server/src/db/models';
import { GenericBtn } from '../components/GenericBtn';
import { LoadingBars } from '../components/LoadingBars';
import { OperationTable } from '../components/Operations/OperationsTable';
import { ReactComponent as Add } from '../icons/Add.svg';
import { ReactComponent as FileAdd } from '../icons/FileAdd.svg';
import { SideMenu } from '../components/SideMenu';
import { State } from '../store/reducers';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { UpsertOperationDialog } from '../components/Operations/UpsertOperationDialog';
import {
  receiveCategories,
  requestCategories,
  getOperations,
} from '../store/actions/operations';

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
    const getCategories = () => {
      return async (dispatch: Function) => {
        dispatch(requestCategories());
        try {
          const res = await fetch('/categories', {
            method: 'GET',
          });
          if (res.status === 200) {
            const { categories }: { categories: Category[] } = await res.json();

            const selectCategories = categories.map(
              ({ id, title }: Category) => ({
                value: id,
                label: title,
              }),
            );
            dispatch(receiveCategories(selectCategories));
          }
        } catch (error) {
          console.error(error);
        }
      };
    };

    if (operations.length < 1) {
      dispatch(getCategories());
      dispatch(getOperations());
    }
  }, [dispatch, operations.length]);

  return (
    <div className="main-container">
      <SideMenu />
      <div className="operations-container">
        {isFetchingCategories || isFetchingOperations ? (
          <LoadingBars />
        ) : (
          <>
            <div className="action-buttons-container">
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
            </div>
            <OperationTable />
          </>
        )}
      </div>
    </div>
  );
};
