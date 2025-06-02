import React, { useState, useEffect } from "react";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  onReset: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, onReset }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    if (selectedFile) {
      console.log(
        "Selected file:",
        selectedFile.name,
        "Size:",
        selectedFile.size,
        "Type:",
        selectedFile.type
      );
      setFile(selectedFile);
      const previewUrl = URL.createObjectURL(selectedFile);
      console.log("Preview URL set:", previewUrl);
      setPreview(previewUrl);
    } else {
      console.log("No file selected");
      setFile(null);
      setPreview(null);
    }
  };

  const handleSubmit = () => {
    if (file) {
      console.log("Submitting file:", file.name);
      onUpload(file);
    } else {
      console.log("No file to submit");
    }
  };

  const handleResetClick = () => {
    console.log("Resetting ImageUploader states");
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setFile(null);
    setPreview(null);
    onReset();
  };

  useEffect(() => {
    return () => {
      if (preview) {
        console.log("Revoking preview URL:", preview);
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  return (
    <div className="mt-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        data-testid="file-input"
        className="mb-2"
      />
      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-32 h-32 object-cover mb-2"
        />
      )}
      <div className="flex space-x-2">
        <button
          onClick={handleSubmit}
          disabled={!file}
          data-testid="submit-button"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Submit
        </button>
        <button
          onClick={handleResetClick}
          disabled={!file}
          data-testid="reset-button"
          className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
