import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    onFileSelect(acceptedFiles[0])
  }, [onFileSelect]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    acceptedFiles,
  } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/json': []
    }
  });

  const selectedFile = acceptedFiles[0];

return (
  <div {...getRootProps({
    className: `
        fixed bottom-4 left-4 
        z-50 w-80 max-w-sm 
        p-4 bg-white border border-gray-300 
        rounded-lg shadow-lg 
        flex flex-col items-start gap-2 
        text-sm text-gray-700 
        hover:shadow-xl transition-shadow
        cursor-pointer
    `
  })}>
    <input {...getInputProps()} />
    {isDragActive ? (
      <p className="font-medium">Drop the JSON file here ...</p>
    ) : (
      <p>Drag & drop an IR JSON file here, or click to select one. Upload one file at a time.</p>
    )}

    {selectedFile && (
      <div>
        <strong>Selected:</strong> {selectedFile.name}
      </div>
    )}
  </div>
);
};

export default FileUpload;