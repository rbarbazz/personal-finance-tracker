import { useDispatch } from 'react-redux';
import Dialog from '@material-ui/core/Dialog';
import React, { useState, useRef } from 'react';

import '../../styles/UploadDialog.scss';
import { GenericBtn } from '../GenericBtn';
import { getOperations } from '../../store/actions/operations';
import { InfoMessage } from '../InfoMessage';
import { logout } from '../SideMenu';
import { ReactComponent as UploadIcon } from '../../icons/Upload.svg';
import { ReactComponent as ArrowRightIcon } from '../../icons/ArrowRight.svg';
import { UploadCategoryMatch } from './UploadCategoryMatch';

export const UploadDialog: React.FC<{
  toggleUpload: Function;
}> = ({ toggleUpload }) => {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState('');
  const [headers, setHeaders] = useState([] as string[]);
  const [isLoading, toggleLoading] = useState(false);
  const [message, setMessage] = useState({ error: false, value: '' });
  const [colMatches, setColMatches] = useState<{ [index: string]: string }>({
    amount: '',
    category: '',
    date: '',
    label: '',
  });
  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFile = (files: FileList) => {
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
        const res = await fetch('/api/operations/read-csv-col', {
          method: 'POST',
          body: data,
        });
        toggleLoading(false);
        if (res.status === 200) {
          const { error, message, headers, path } = await res.json();

          for (const header of headers) {
            const found = Object.keys(colMatches).find(
              colName => colName === header,
            );
            if (found) setColMatches(prev => ({ ...prev, [found]: found }));
          }
          setHeaders(headers);
          setFileName(path);
          setMessage({ error, value: message });
        } else dispatch(logout());
      } catch (error) {
        setMessage({ error: true, value: 'An error has occurred' });
      }
    };
  };

  const sendMatchedCols = () => {
    return async (dispatch: Function) => {
      const { amount, date, label } = colMatches;
      if (!amount || !date || !label)
        return setMessage({
          error: true,
          value: 'Please match at least amount, date and label',
        });
      toggleLoading(true);

      try {
        const res = await fetch('/api/operations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ colMatches, path: fileName }),
        });
        toggleLoading(false);
        if (res.status === 200) {
          const { error, message } = await res.json();

          setMessage({ error, value: message });
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

  return (
    <Dialog onClose={() => toggleUpload(false)} open>
      <div className="upload-dialog">
        <h3 className="upload-title">Import Transactions</h3>
        {headers.length > 0 ? (
          <div className="col-match-container">
            {['amount', 'category', 'date', 'label'].map(colName => (
              <UploadCategoryMatch
                colName={colName}
                headers={headers}
                key={colName}
                setColMatches={setColMatches}
                value={colMatches[colName]}
              />
            ))}
          </div>
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
            if (
              headers.length < 1 &&
              fileInput &&
              fileInput.current &&
              fileInput.current.files
            )
              dispatch(uploadFile(fileInput.current.files));
            else if (headers.length > 0) dispatch(sendMatchedCols());
          }}
          id="upload-csv-btn"
          isLoading={isLoading}
        >
          {headers.length > 0 ? (
            <>
              Upload
              <UploadIcon />
            </>
          ) : (
            <>
              Match Columns
              <ArrowRightIcon />
            </>
          )}
        </GenericBtn>
      </div>
    </Dialog>
  );
};
