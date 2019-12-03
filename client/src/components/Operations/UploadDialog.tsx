import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import React, { useState, useRef } from 'react';

import '../../styles/UploadDialog.scss';
import { GenericBtn } from '../GenericBtn';
import { getOperations } from '../../store/actions/operations';
import { InfoMessage } from '../InfoMessage';
import { logout } from '../SideMenu';

const uploadFiles = (
  files: FileList,
  hasReadCol: boolean,
  setColList: Function,
  setMessage: Function,
  toggleLoading: Function,
  toggleUpload: Function,
) => {
  return async (dispatch: Function) => {
    if (files.length < 1)
      return setMessage({
        error: true,
        value: 'Please select a file',
      });
    toggleLoading(true);

    const data = new FormData();

    data.append('csvFiles', files[0], files[0].name);
    try {
      const res = await fetch(
        `/operations${hasReadCol ? '' : '/read-csv-col'}`,
        {
          method: 'POST',
          body: data,
        },
      );
      toggleLoading(false);
      if (res.status === 200) {
        const jsonDecoded = await res.json();
        const { error, message } = jsonDecoded;

        setMessage({ error, value: message });
        if (!hasReadCol) {
          const { headers } = jsonDecoded;

          return setColList(headers);
        }
        if (!error) {
          toggleUpload(false);
          dispatch(getOperations());
        }
      } else dispatch(logout());
    } catch (error) {
      setMessage({ error: true, value: 'An error has occurred' });
    }
  };
};

export const UploadDialog: React.FC<{
  toggleUpload: Function;
}> = ({ toggleUpload }) => {
  const dispatch = useDispatch();
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [fileName, setFileName] = useState('');
  const [colList, setColList] = useState([] as string[]);
  const [colMatches, setColMatches] = useState({
    amount: '',
    category: '',
    date: '',
    label: '',
  });
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <Dialog onClose={() => toggleUpload(false)} open>
      <div className="upload-dialog">
        <h3 className="upload-title">Import Transactions</h3>
        {colList.length > 0 ? (
          <div className="col-match-container"></div>
        ) : (
          <>
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
                If you choose to use a file provided by your bank for instance,
                it needs to contain at least those three columns:{' '}
                <code>date</code>, <code>amount</code> and <code>label</code>.
              </li>
              <li className="upload-explanation-item">
                <strong>Note:</strong> expected date formats are{' '}
                <code>YYYY-MM-DD</code> or <code>DD-MM-YYYY</code>.
              </li>
            </ul>
            <label id="upload-input-label" htmlFor="upload-input">
              {fileName === '' ? 'Select a file' : fileName}
            </label>
            <input
              accept=".csv"
              id="upload-input"
              name="files"
              ref={fileInput}
              onChange={event => {
                if (event.target.files) setFileName(event.target.files[0].name);
              }}
              type="file"
            />
          </>
        )}
        {message.value !== '' && (
          <InfoMessage error={message.error} value={message.value} />
        )}
        <GenericBtn
          action={() => {
            if (fileInput && fileInput.current && fileInput.current.files)
              dispatch(
                uploadFiles(
                  fileInput.current.files,
                  colList.length > 0,
                  setColList,
                  setMessage,
                  toggleLoading,
                  toggleUpload,
                ),
              );
          }}
          id="upload-csv-btn"
          isLoading={isLoading}
          value={colList.length > 0 ? 'Upload' : 'Match Columns'}
        />
      </div>
    </Dialog>
  );
};
