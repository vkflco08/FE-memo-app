import React from 'react';
import './FileUpload.css'; // 스타일 파일

const FileUpload = ({ onChange }) => {
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onChange(file); // 부모 컴포넌트로 파일 전달
    }
  };

  return (
    <div className="file-upload-container">
      <label htmlFor="fileInput" className="file-upload-label">
        <input
          type="file"
          id="fileInput"
          onChange={handleFileSelect}
          className="file-upload-input"
        />
        <button
          type="button"
          onClick={() => document.getElementById('fileInput').click()}
          className="file-upload-button"
        >
          파일 선택
        </button>
      </label>
    </div>
  );
};

export default FileUpload;
