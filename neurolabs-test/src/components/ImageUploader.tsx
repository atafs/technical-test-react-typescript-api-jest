import React, { useState } from "react";

interface Props {
  onUpload: (file: File) => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="mb-2"
        data-testid="file-input" // Added for testing
      />
      {preview && (
        <img
          src={preview}
          alt="Preview"
          className="w-full h-32 object-cover rounded"
        />
      )}
    </div>
  );
};

export default ImageUploader;
