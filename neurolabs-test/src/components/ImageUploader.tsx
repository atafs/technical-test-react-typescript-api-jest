import React, { useState, useRef } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploadDisabled, setIsUploadDisabled] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      console.log(
        "Selected file:",
        selectedFile.name,
        "Size:",
        selectedFile.size,
        "Type:",
        selectedFile.type
      );
      console.log("Preview URL set:", url);
      setIsUploadDisabled(false); // Enable upload button when a new file is selected
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Submitting file:", file.name);
      onUpload(file);
      setIsUploadDisabled(true); // Disable upload button after submission
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Clear input for re-selection
      }
    }
  };

  const handleResetClick = () => {
    console.log("Resetting ImageUploader states");
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input for re-selection
    }
    setFile(null);
    if (previewUrl) {
      console.log("Revoking preview URL:", previewUrl);
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setIsUploadDisabled(false); // Re-enable upload button
    onReset();
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        data-testid="file-input"
        ref={fileInputRef}
      />
      {previewUrl && (
        <div className="mb-2">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-xs rounded shadow-md"
          />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!file || isUploadDisabled}
          className="relative px-4 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-md hover:bg-blue-700 transition-all duration-300 disabled:bg-gradient-to-r disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-none"
          data-testid="submit-button"
          title={!file ? "Please select an image to upload" : isUploadDisabled ? "Image already uploaded" : "Upload image"}
        >
          <span className="flex items-center gap-2">
            {(!file || isUploadDisabled) && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11v6m0 0l-3-3m3 3l3-3m-9-3a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            )}
            Upload
          </span>
        </button>
        <button
          onClick={handleResetClick}
          disabled={!file}
          className="relative px-4 py-2 bg-red-600 text-white rounded-lg font-medium shadow-md hover:bg-red-700 transition-all duration-300 disabled:bg-gradient-to-r disabled:from-gray-300 disabled:to-gray-400 disabled:text-gray-600 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-none"
          data-testid="reset-button"
        >
          <span className="flex items-center gap-2">
            {(!file || isUploadDisabled) && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 11v6m0 0l-3-3m3 3l3-3m-9-3a9 9 0 1118 0 9 9 0 01-18 0z"
                />
              </svg>
            )}
            Reset
          </span>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;