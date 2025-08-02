import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fullscreen?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fullscreen }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
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

  if (fullscreen) {
    return (
      <div {...getRootProps({
        className:
            `fixed top-1/2 left-1/2
            transform -translate-x-1/2 -translate-y-1/2
            z-50 w-1/3 h-1/3  
            p-4 bg-white border border-gray-300 
            rounded-lg shadow-lg 
            flex items-center justify-center text-center
            text-xl text-gray-700 
            hover:shadow-xl transition-shadow
            cursor-pointer`
      })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="font-medium">Drop the JSON file here ...</p>
        ) : (
          <p><strong>Get started!</strong> Drag & drop an IR JSON file here, or click to select one. Upload one file at a time.</p>
        )}
      </div>
    );
  } else {
      return (
        <div className={`
          fixed bottom-4 right-4 
          z-50 w-1/5
          p-4 bg-blue-300 bg-opacity-60
          rounded-lg shadow-lg 
          flex flex-col items-start gap-2 
          text-sm text-gray-700 
          hover:shadow-xl transition-shadow
          cursor-pointer
        `}>
          <h2 className="text-lg font-semibold text-black mb-4">Upload Additional IR JSON Files</h2>

          <div className="flex flex-col items-center gap-4 mb-4">
            {/* File Drop Area */}
            <div {...getRootProps({
              className:
                `flex-1 p-4 bg-white border border-gray-300 rounded-lg shadow-lg 
                flex flex-col items-start gap-2 text-sm text-gray-700 
                hover:shadow-xl transition-shadow cursor-pointer`
            })}>
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="font-medium">Drop the JSON file here ...</p>
              ) : (
                <p>Drag & drop an IR JSON file here, or click to select one. Upload one file at a time.</p>
              )}

              {selectedFile && (
                <div>
                  <strong>Upload successful! Check the timeline for new entries.</strong>
                </div>
              )}
            </div>
            
            {/* Reset Button */}
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset Timeline
            </button>
          </div>
        </div>
      );
    }
};

export default FileUpload;