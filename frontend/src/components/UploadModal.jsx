import React, { useState, useRef } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { showErrorToast } from "./toast";

const UploadModal = ({ isOpen, onClose, onUpload, imagesCount }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    addFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    addFiles(files);
  };

  const addFiles = (files) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      return [...prevFiles, ...newFiles];
    });
  };

  const removeFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = async () => {
    if (selectedFiles.length + imagesCount > 5) {
      showErrorToast("You can upload up to 5 images per warehouse.");
      return;
    }
    setUploading(true);
    await onUpload(selectedFiles.map((f) => f.file));
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="flex flex-column text-xl font-semibold">
            <span>Upload photos</span>
            {selectedFiles.length > 0 && (
              <span className="text-gray-500 text-sm ml-2">
                {selectedFiles.length} items selected
              </span>
            )}
          </h2>
          <div></div>
        </div>

        {/* Content */}
        <div className="p-4">
          {selectedFiles.length === 0 ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 ${
                isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 mb-4">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-full h-full text-gray-400"
                  >
                    <path
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M14 8a2 2 0 11-4 0 2 2 0 014 0z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <p className="text-xl mb-2">Drag and drop</p>
                <p className="text-gray-500 mb-4">or browse for photos</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Browse
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative group aspect-square">
                    <img
                      src={file.preview}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1.5 bg-gray-50 rounded-full opacity-100 hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              {selectedFiles.length + imagesCount > 5 && (
                <p className="text-red-500 mt-2 font-semibold">
                  Limit Exceeded! Your warehouse already has {imagesCount}{" "}
                  image(s). You can upload only {5 - imagesCount} more image(s).
                </p>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between p-4 border-t">
          <button
            onClick={onClose}
            className="px-6 py-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {selectedFiles.length === 0 ? "Done" : "Cancel"}
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={handleUpload}
              className="flex items-center px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              disabled={uploading}
            >
              {uploading ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <span>Upload</span>
              )}
              {uploading ? <span className="">Uploading...</span> : ""}
            </button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
};

export default UploadModal;
