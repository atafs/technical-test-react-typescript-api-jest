import React, { useState, useEffect, useRef } from "react";

interface Props {
  onUpload: (file: File) => Promise<void>;
  onReset: () => void;
}

const ImageUploader: React.FC<Props> = ({ onUpload, onReset }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false); // New state for submission status
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to clear input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Selected file is not an image");
        }
        const previewUrl = URL.createObjectURL(file);
        console.log("Preview URL set:", previewUrl);
        setPreview(previewUrl);
        setSelectedFile(file);
        setError(null);
        setIsSubmitting(false);
        setIsSubmitted(false); // Reset submission status on new file selection
      } catch (err: any) {
        console.error("Error generating preview:", err.message);
        setError(`Failed to load preview: ${err.message}`);
        setPreview(null);
        setSelectedFile(null);
        setIsSubmitting(false);
        setIsSubmitted(false);
      }
    } else {
      console.log("No file selected");
      setError("No file selected");
      setPreview(null);
      setSelectedFile(null);
      setIsSubmitting(false);
      setIsSubmitted(false);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile && !isSubmitting && !isSubmitted) {
      setIsSubmitting(true);
      console.log("Submitting file:", selectedFile.name);
      try {
        await onUpload(selectedFile);
        setError(null);
        setIsSubmitted(true); // Mark as submitted on success
      } catch (err: any) {
        console.error("Submission error:", err.message);
        setError(`Failed to submit image: ${err.message}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setError("No image selected to submit");
    }
  };

  const handleReset = () => {
    console.log("Resetting ImageUploader states");
    if (preview && typeof URL.revokeObjectURL === "function") {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setSelectedFile(null);
    setError(null);
    setIsSubmitting(false);
    setIsSubmitted(false); // Re-enable submit button on reset
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear input to allow re-selection
    }
    onReset();
  };

  useEffect(() => {
    if (preview) {
      console.log("Preview state updated, rendering img tag");
      return () => {
        if (typeof URL.revokeObjectURL === "function") {
          console.log("Revoking preview URL:", preview);
          URL.revokeObjectURL(preview);
        }
      };
    }
  }, [preview]);

  return (
    <div className="mb-4">
      <label className="inline-block px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 cursor-pointer">
        Upload Image
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          data-testid="file-input"
          ref={fileInputRef} // Attach ref to input
        />
      </label>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {preview && (
        <div className="mt-2">
          <img
            src={preview}
            alt="Preview"
            className="block w-full max-w-[400px] h-64 object-contain rounded border border-gray-300"
            onError={(e) => {
              console.error("Image failed to load:", e);
              setError("Failed to display image preview");
              setPreview(null);
              setSelectedFile(null);
              setIsSubmitting(false);
              setIsSubmitted(false);
            }}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || isSubmitted} // Disable if submitting or submitted
              className={`px-4 py-2 text-white font-medium rounded-lg shadow-md transition-colors duration-300 ${
                isSubmitting || isSubmitted
                  ? "bg-indigo-400 opacity-50 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              data-testid="submit-button"
            >
              {isSubmitting ? "Submitting..." : "Submit Image"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300"
              data-testid="reset-button"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
