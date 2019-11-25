import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import React, { useState, useRef } from 'react';

import '../../styles/UploadDialog.scss';
import { GenericBtn } from '../GenericBtn';
import { getOperations } from '../../store/actions/operations';
import { InfoMessage } from '../InfoMessage';

export const UploadDialog: React.FC<{
  toggleUpload: Function;
}> = ({ toggleUpload }) => {
  const dispatch = useDispatch();
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [fileCount, setFileCount] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFiles = async (files: FileList) => {
    if (files.length < 1)
      return setMessage({
        error: true,
        value: 'Please select at least one file',
      });
    toggleLoading(true);
    const data = new FormData();

    Array.from(files).forEach(file => {
      data.append('csvFiles', file, file.name);
    });
    try {
      const res = await fetch('/operations', {
        method: 'POST',
        body: data,
      });
      toggleLoading(false);
      if (res.status === 200) {
        const { error, message } = await res.json();

        setMessage({ error, value: message });
        if (!error) {
          toggleUpload(false);
          dispatch(getOperations());
        }
      } else {
        setMessage({ error: true, value: 'User is not logged in' });
      }
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };

  return (
    <Dialog onClose={() => toggleUpload(false)} open>
      <div className="upload-dialog">
        <h3 className="upload-title">Import Transactions</h3>
        <ul className="upload-explanations">
          <li className="upload-explanation-item">
            You can bulk import transactions by uploading CSV files.
          </li>
          <li className="upload-explanation-item">
            We recommend that you use{' '}
            <a
              href="https://docs.google.com/spreadsheets/d/1EVnQDnhxwYtDYWoHcf8sa14JfBgZKtwgJF5-NTiHEII/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
            >
              this template
            </a>{' '}
            as it is preformatted.
          </li>
          <li className="upload-explanation-item">
            If you choose to use a file provided by your bank for instance, it
            needs to contain at least those three columns: <code>date</code>,{' '}
            <code>amount</code> and <code>label</code>.
          </li>
          <li className="upload-explanation-item">
            <strong>Note:</strong> expected date formats are{' '}
            <code>YYYY-MM-DD</code> or <code>DD-MM-YYYY</code>.
          </li>
        </ul>
        <label id="upload-input-label" htmlFor="upload-input">
          {fileCount > 0
            ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected`
            : 'Select one or more files'}
        </label>
        <input
          accept=".csv"
          id="upload-input"
          multiple
          name="files"
          ref={fileInput}
          onChange={event => {
            if (event.target.files) setFileCount(event.target.files.length);
          }}
          type="file"
        />
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() => {
            if (fileInput && fileInput.current && fileInput.current.files)
              uploadFiles(fileInput.current.files);
          }}
          id="upload-csv-btn"
          isLoading={isLoading}
          value="Upload"
        />
      </div>
    </Dialog>
  );
};
