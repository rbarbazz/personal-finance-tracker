import React, { useState, useEffect } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import '../styles/Operations.scss';
import { SideMenu } from '../components/SideMenu';
import { GenericBtn } from '../components/GenericBtn';
import { AddOperationDialog } from '../components/AddOperationDialog';
import { UploadDialog } from '../components/UploadDialog';

export const Operations: React.FC<{ toggleIsLoggedIn: Function }> = ({
  toggleIsLoggedIn,
}) => {
  const [newOperationVisible, toggleNewOperation] = useState(false);
  const [uploadVisible, toggleUpload] = useState(false);
  const [operationList, setOperationList] = useState<Operation[]>([]);
  const getOperations = async () => {
    try {
      const res = await fetch('/operations', {
        method: 'GET',
      });
      if (res.status === 200) {
        const { operations }: { operations: Operation[] } = await res.json();

        setOperationList(operations);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getOperations();
  }, [newOperationVisible]);

  return (
    <div className="main-container">
      <SideMenu toggleIsLoggedIn={toggleIsLoggedIn} />
      <div className="operations-container">
        <div className="action-buttons-container">
          <GenericBtn
            action={() => toggleUpload(!uploadVisible)}
            value="Upload CSV"
          />
          {uploadVisible && (
            <UploadDialog toggleUpload={toggleUpload} open={true} />
          )}
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
        <div className="table-container">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {operationList.map(row => {
                const { id, operationDate, amount, label, title } = row;
                const dateLocale = new Date(operationDate).toLocaleDateString();

                return (
                  <TableRow key={`row${id}`}>
                    <TableCell component="th" scope="row">
                      {dateLocale}
                    </TableCell>
                    <TableCell>{amount}</TableCell>
                    <TableCell>{label}</TableCell>
                    <TableCell>{title}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};
