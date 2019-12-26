import React from 'react';

import { ReactComponent as ArrowRightIcon } from '../../icons/ArrowRight.svg';

export const UploadCategoryMatch: React.FC<{
  colName: string;
  headers: string[];
  setColMatches: (
    value: React.SetStateAction<{ [index: string]: string }>,
  ) => void;
  value: string;
}> = ({ colName, headers, setColMatches, value }) => (
  <div className="upload-category-container">
    <span className="col-name-wrapper">
      <p className="generic-chip">{colName}</p>
    </span>
    <ArrowRightIcon />
    <select
      onChange={event => {
        const newValue = event.target.value;

        setColMatches(prev => ({
          ...prev,
          [colName]: newValue,
        }));
      }}
      value={value}
    >
      <option value="" disabled />
      {headers.map(header => (
        <option key={`${colName}-${header}`} value={header}>
          {header}
        </option>
      ))}
    </select>
  </div>
);
