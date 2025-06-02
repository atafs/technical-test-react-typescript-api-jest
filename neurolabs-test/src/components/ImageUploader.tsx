import React, { useState, useEffect } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Submitting file:", file.name);
      onUpload(file);
    }
  };

  const handleResetClick = () => {
    console.log("Resetting ImageUploader states");
    setFile(null);
    if (previewUrl) {
      console.log("Revoking preview URL:", previewUrl);
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onReset();
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
        data-testid="file-input"
      />
      {previewUrl && (
        <div className="mb-2">
          <img src={previewUrl} alt="Preview" className="max-w-xs" />
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={!file}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300"
          data-testid="submit-button"
        >
          Upload
        </button>
        <button
          onClick={handleResetClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          data-testid="reset-button"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
