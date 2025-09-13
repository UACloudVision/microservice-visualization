import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import NotificationToast from './NotificationToast';

interface Notification {
    type: 'error' | 'warning' | 'success' | 'info';
    message: string;
    duration?: number;
}

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  fullscreen?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, fullscreen }) => {
  const [notification, setNotification] = useState<Notification | null>(null);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if(file){
      onFileSelect(file);
      setNotification({
        type: 'success',
        message: `Upload successful!`,
        duration: 5000
      });
    }
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
        className:`
          fixed top-1/2 left-1/2
          transform -translate-x-1/2 -translate-y-1/2
          z-50 w-1/3 h-1/3
          p-4 bg-white border-4 border-dashed border-purple-300
          rounded-xl shadow-lg
          flex items-center justify-center text-center
          text-xl text-gray-700
          hover:shadow-xl hover:border-purple-500 transition-all
          cursor-pointer
          group`
      })}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl">↑</span>
            </div>
            <p className="font-medium">Drop the JSON file here ...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/upload.png" 
              alt="Upload Icon" 
              className="w-20 h-20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"
            />
            <div className="text-center">
              <p className="font-bold mb-2">Get started!</p>
              <p className="mb-1">Drag & drop an IR JSON file here</p>
              <p className="mb-1">or click to select one.</p>
              <p className="text-sm text-gray-500">Upload one file at a time.</p>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={`
        fixed bottom-4 left-4
        z-50 w-1/6
        p-4 bg-blue-300 bg-opacity-40
        rounded-xl shadow-lg
        flex flex-col items-center justify-center gap-2
        text-center text-sm text-gray-700
        hover:shadow-xl transition-shadow
        cursor-pointer
        `}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Additional IR JSON Files</h2>
        <div className="flex flex-col items-center gap-4 mb-4">
          {/* File Drop Area */}
          <div {...getRootProps({
            className:
              `flex-1 p-4 bg-white border border-gray-300 rounded-xl shadow-lg
              flex flex-col items-start gap-2 text-sm text-gray-700
              hover:shadow-xl transition-shadow cursor-pointer`
          })}>
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="font-medium">Drop the JSON file here ...</p>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <img 
                  src="/upload.png" 
                  alt="Upload Icon" 
                  className="w-20 h-20 opacity-50 group-hover:opacity-80 transition-opacity duration-300"
                />
                <div className="text-center">
                  <p className="text-sm">Drag & drop an IR JSON file here</p>
                  <p className="text-sm">or click to select one.</p>
                  <p className="text-xs text-gray-500">Upload one file at a time.</p>
                </div>
              </div>
            )}
          </div>
          {/* Reset Button */}
          <button
            onClick={() => window.location.reload()}
            className="px-20 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
          >
            Reset Timeline
          </button>
        </div>
      </div>
    );
  }
};
export default FileUpload;