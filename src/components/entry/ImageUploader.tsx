import React, { ChangeEvent } from "react";
import "./ImageUploader.css"; 

interface ImageUploaderProps {
  onImageSelect: (imageFiles: File[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageFiles: File[] = Array.from(files);
      onImageSelect(imageFiles);
    }
  };

  return (
    <div className="image-uploader-container">
      <input
        id="file-upload"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
      />
      <label htmlFor="file-upload" className="upload-button">
        Add Images
      </label>
    </div>
  );
};

export default ImageUploader;