import React, { useState, useRef } from 'react';
import Dialog from '@material-ui/core/Dialog';

import '../../styles/UploadDialog.scss';
import { GenericBtn } from '../GenericBtn';
import { InfoMessage } from '../InfoMessage';

export const UploadDialog: React.FC<{
  toggleUpload: Function;
}> = ({ toggleUpload }) => {
  const uploadFiles = async (files: FileList) => {
    if (files.length < 1)
      return setMessage({
        error: true,
        value: 'Please select at least one CSV file',
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
        }
      } else {
        setMessage({ error: true, value: 'User is not logged in' });
      }
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <Dialog onClose={() => toggleUpload(false)} open>
      <div className="upload-dialog">
        <h3 className="upload-title">Import Transactions</h3>
        <p className="upload-explanations">
          You can batch import transactions by uploading CSV files.
          <br />
          <br />
          Files need to contain at least those four columns: "date", "amount",
          "label" and "category".
        </p>
        <label id="upload-input-label" htmlFor="upload-input">
          Select one or more files
        </label>
        <input
          accept=".csv"
          id="upload-input"
          multiple
          name="files"
          ref={fileInput}
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
