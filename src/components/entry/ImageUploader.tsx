import React, { ChangeEvent } from "react";


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
        <div className="flex flex-col items-center">
            <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImageChange}
            />
            <label
                htmlFor="file-upload"
                className="bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-cyan-600 transition duration-300"
            >
                Add Images
            </label>
        </div>
    );
};

export default ImageUploader;