import { OptionTypeBase } from 'react-select';
import React, { useState, useEffect } from 'react';

import '../styles/Operations.scss';
import { GenericBtn } from '../components/GenericBtn';
import { LoadingBars } from '../components/LoadingBars';
import { OperationRow, CategoryDB } from '../../../server/src/db/models';
import { OperationTable } from '../components/Operations/OperationsTable';
import { ReactComponent as Add } from '../icons/Add.svg';
import { ReactComponent as FileAdd } from '../icons/FileAdd.svg';
import { SideMenu } from '../components/SideMenu';
import { UploadDialog } from '../components/Operations/UploadDialog';
import { UpsertOperationDialog } from '../components/Operations/UpsertOperationDialog';

export const Operations: React.FC = () => {
  const [addOperationVisible, toggleAddDialog] = useState(false);
  const [isLoading, toggleLoading] = useState(true);
  const [operationList, setOperationList] = useState<OperationRow[]>([]);
  const [categoryList, setCategoryList] = useState<OptionTypeBase[]>([]);
  const [uploadVisible, toggleUpload] = useState(false);
  const getOperations = async () => {
    try {
      const res = await fetch('/operations', {
        method: 'GET',
      });
      toggleLoading(false);
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
  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch('/categories', {
          method: 'GET',
        });
        if (res.status === 200) {
          const { categories }: { categories: CategoryDB[] } = await res.json();

          setCategoryList(
            categories.map(({ id, title }: CategoryDB) => ({
              value: id,
              label: title,
            })),
          );
        }
      } catch (error) {
        console.error(error);
      }
    };
    getCategories();
  }, []);

  return (
    <div className="main-container">
      <SideMenu />
      <div className="operations-container">
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
            <UpsertOperationDialog
              categoryList={categoryList}
              getOperations={getOperations}
              toggleDialog={toggleAddDialog}
            />
          )}
        </div>
        {isLoading ? (
          <LoadingBars />
        ) : (
          operationList.length > 0 && (
            <OperationTable
              categoryList={categoryList}
              getOperations={getOperations}
              operationList={operationList}
            />
          )
        )}
      </div>
    </div>
  );
};
